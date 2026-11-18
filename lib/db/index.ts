import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Table, Tables } from "./types";

// One small interface over two stores:
// - Supabase, when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set. The key
//   stays on the server; the browser never talks to Supabase.
// - Otherwise a JSON file per table in .data/db (not committed), so the site and
//   the admin work on a laptop with no setup. Not for production: a host with
//   several servers or no disk would lose data.
//
// Lists are read whole and filtered in code. That is fine for the volumes a
// consultancy site has (thousands of rows), and keeps both stores identical.

type Row<T extends Table> = Tables[T];
type NewRow<T extends Table> = Omit<Row<T>, "id" | "created_at" | "updated_at"> & { id?: string };

export interface Store {
  readonly kind: "supabase" | "local";
  all<T extends Table>(table: T): Promise<Row<T>[]>;
  get<T extends Table>(table: T, id: string): Promise<Row<T> | null>;
  insert<T extends Table>(table: T, row: NewRow<T>): Promise<Row<T>>;
  update<T extends Table>(table: T, id: string, patch: Partial<Row<T>>): Promise<Row<T> | null>;
  remove<T extends Table>(table: T, ids: string[]): Promise<void>;
  getSetting<V>(key: string): Promise<V | null>;
  setSetting<V>(key: string, value: V): Promise<void>;
  putFile(file: string, data: Buffer, contentType: string): Promise<void>;
  readFile(file: string): Promise<Buffer | null>;
  removeFiles(files: string[]): Promise<void>;
  /** A short-lived link to download a private file, or null to stream it through the admin. */
  signedUrl(file: string, downloadName: string): Promise<string | null>;
}

const now = () => new Date().toISOString();
const newest = <R extends { created_at: string }>(rows: R[]) =>
  rows.sort((a, b) => b.created_at.localeCompare(a.created_at));

/* ---------------------------------------------------------------- local --- */

// DATA_DIR moves the local store, for example to keep a test run apart.
const root = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), ".data");
const tableFile = (t: string) => path.join(root, "db", `${t}.json`);
let queue: Promise<unknown> = Promise.resolve();
/** Runs file writes one after another so two requests cannot overwrite each other. */
function serial<R>(task: () => Promise<R>): Promise<R> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

async function readJson<V>(file: string, fallback: V): Promise<V> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as V;
  } catch {
    return fallback;
  }
}
async function writeJson(file: string, value: unknown) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2));
}
const safe = (file: string) => {
  const full = path.join(root, "files", file);
  if (!full.startsWith(path.join(root, "files") + path.sep)) throw new Error("Bad file path");
  return full;
};

const local: Store = {
  kind: "local",
  async all(table) {
    return newest(await readJson(tableFile(table), []));
  },
  async get(table, id) {
    const rows = await readJson<Row<typeof table>[]>(tableFile(table), []);
    return rows.find((r) => r.id === id) ?? null;
  },
  insert(table, row) {
    return serial(async () => {
      const rows = await readJson<Row<typeof table>[]>(tableFile(table), []);
      const full = { ...row, id: row.id ?? randomUUID(), created_at: now(), updated_at: now() } as Row<typeof table>;
      rows.push(full);
      await writeJson(tableFile(table), rows);
      return full;
    });
  },
  update(table, id, patch) {
    return serial(async () => {
      const rows = await readJson<Row<typeof table>[]>(tableFile(table), []);
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) return null;
      rows[i] = { ...rows[i], ...patch, id, updated_at: now() };
      await writeJson(tableFile(table), rows);
      return rows[i];
    });
  },
  remove(table, ids) {
    return serial(async () => {
      const rows = await readJson<Row<typeof table>[]>(tableFile(table), []);
      await writeJson(
        tableFile(table),
        rows.filter((r) => !ids.includes(r.id)),
      );
    });
  },
  async getSetting(key) {
    const all = await readJson<Record<string, unknown>>(tableFile("settings"), {});
    return (all[key] as never) ?? null;
  },
  setSetting(key, value) {
    return serial(async () => {
      const all = await readJson<Record<string, unknown>>(tableFile("settings"), {});
      all[key] = value;
      await writeJson(tableFile("settings"), all);
    });
  },
  async putFile(file, data) {
    const full = safe(file);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data);
  },
  async readFile(file) {
    try {
      return await readFile(safe(file));
    } catch {
      return null;
    }
  },
  async removeFiles(files) {
    await Promise.all(files.filter(Boolean).map((f) => rm(safe(f), { force: true })));
  },
  async signedUrl() {
    return null;
  },
};

/* ------------------------------------------------------------- supabase --- */

/** Public images (logos, covers) go to the "media" bucket; everything else, such as CVs, is private. */
const bucketFor = (file: string) => (file.startsWith("media/") ? "media" : "private-files");

function supabaseStore(client: SupabaseClient): Store {
  const check = <D>({ data, error }: { data: D; error: { message: string } | null }) => {
    if (error) throw new Error(error.message);
    return data;
  };
  return {
    kind: "supabase",
    async all(table) {
      return check(await client.from(table).select("*").order("created_at", { ascending: false }).limit(10000)) as never;
    },
    async get(table, id) {
      return check(await client.from(table).select("*").eq("id", id).maybeSingle()) as never;
    },
    async insert(table, row) {
      return check(await client.from(table).insert(row).select("*").single()) as never;
    },
    async update(table, id, patch) {
      const clean = { ...patch } as Record<string, unknown>;
      delete clean.id;
      delete clean.created_at;
      delete clean.updated_at;
      return check(await client.from(table).update(clean).eq("id", id).select("*").maybeSingle()) as never;
    },
    async remove(table, ids) {
      if (ids.length) check(await client.from(table).delete().in("id", ids));
    },
    async getSetting(key) {
      const row = check(await client.from("settings").select("value").eq("key", key).maybeSingle()) as { value: never } | null;
      return row?.value ?? null;
    },
    async setSetting(key, value) {
      check(await client.from("settings").upsert({ key, value }));
    },
    async putFile(file, data, contentType) {
      check(await client.storage.from(bucketFor(file)).upload(file, data, { contentType, upsert: false }));
    },
    async readFile(file) {
      const { data, error } = await client.storage.from(bucketFor(file)).download(file);
      return error || !data ? null : Buffer.from(await data.arrayBuffer());
    },
    async removeFiles(files) {
      for (const bucket of ["media", "private-files"]) {
        const list = files.filter((f) => f && bucketFor(f) === bucket);
        if (list.length) check(await client.storage.from(bucket).remove(list));
      }
    },
    async signedUrl(file, downloadName) {
      const data = check(await client.storage.from(bucketFor(file)).createSignedUrl(file, 600, { download: downloadName }));
      return data?.signedUrl ?? null;
    },
  };
}

let store: Store | null = null;

export function db(): Store {
  if (store) return store;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  store = url && key ? supabaseStore(createClient(url, key, { auth: { persistSession: false } })) : local;
  return store;
}

/** A short reference people can quote, such as TQ-7K2M9P. */
export function reference(prefix: string) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${out}`;
}
