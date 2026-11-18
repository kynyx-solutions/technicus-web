-- Technicus admin: leads, job applications, editable content, settings and SEO.
--
-- Run once in the Supabase SQL editor (or with `supabase db push`). Row level
-- security is on with no policies, so only the server, using the service role
-- key, can read or write. The browser never talks to Supabase directly.

create extension if not exists pgcrypto;

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Form submissions from the site ------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  type text not null,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  company text not null default '',
  country text not null default '',
  services text[] not null default '{}',
  budget text not null default '',
  timeline text not null default '',
  message text not null default '',
  source text not null default '',
  fields jsonb not null default '{}',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  notes jsonb not null default '[]',
  ip text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_created_at on leads (created_at desc);
create index if not exists leads_status on leads (status);
create index if not exists leads_email on leads (lower(email));

-- Job applications ---------------------------------------------------------------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  role text not null default '',
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  city text not null default '',
  link text not null default '',
  message text not null default '',
  cv_path text not null default '',
  cv_name text not null default '',
  status text not null default 'new' check (status in ('new', 'shortlisted', 'interview', 'offered', 'hired', 'rejected')),
  notes text not null default '',
  ip text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists applications_created_at on applications (created_at desc);

-- Articles, case studies, job openings and testimonials ------------------------
create table if not exists content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('articles', 'projects', 'jobs', 'testimonials')),
  slug text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);
create index if not exists content_type_order on content (type, sort_order);

-- Single-row settings: contact details, home page, SEO -------------------------
create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- SEO: keywords being tracked, PageSpeed results --------------------------------
create table if not exists keywords (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  kind text not null default 'target' check (kind in ('target', 'trending')),
  page text not null default '',
  status text not null default 'planned' check (status in ('planned', 'optimised', 'ranking')),
  position integer,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists keywords_term on keywords (lower(term));

create table if not exists pagespeed (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  strategy text not null check (strategy in ('mobile', 'desktop')),
  scores jsonb not null default '{}',
  metrics jsonb not null default '{}',
  opportunities jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pagespeed_path on pagespeed (path, strategy, created_at desc);

do $$
declare t text;
begin
  foreach t in array array['leads', 'applications', 'content', 'settings', 'keywords', 'pagespeed'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop trigger if exists %I_updated_at on %I', t, t);
    execute format('create trigger %I_updated_at before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- Private storage for CVs. Files are only reachable through short-lived links
-- the admin creates.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('private-files', 'private-files', false, 5242880,
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

-- Images uploaded in the admin (client logos, covers). The site serves them at
-- /media/..., reading them with the service key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', false, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;
