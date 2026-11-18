// Row shapes for everything the admin manages. The same shapes are used by the
// Supabase tables (supabase/migrations) and by the local file store.

export type Note = { id: string; text: string; author: string; createdAt: string };

export const leadStatuses = ["new", "contacted", "qualified", "converted", "closed"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export const priorities = ["low", "medium", "high"] as const;
export type Priority = (typeof priorities)[number];

export type LeadRow = {
  id: string;
  ref: string;
  /** Which form: consultation, brief, nda, local. */
  type: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
  source: string;
  /** Every field the visitor sent, as sent. */
  fields: Record<string, string>;
  status: LeadStatus;
  priority: Priority;
  notes: Note[];
  ip: string;
  created_at: string;
  updated_at: string;
};

export const applicationStatuses = ["new", "shortlisted", "interview", "offered", "hired", "rejected"] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export type ApplicationRow = {
  id: string;
  ref: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  link: string;
  message: string;
  cv_path: string;
  cv_name: string;
  status: ApplicationStatus;
  notes: string;
  ip: string;
  created_at: string;
  updated_at: string;
};

export const contentTypes = ["articles", "projects", "jobs", "testimonials"] as const;
export type ContentType = (typeof contentTypes)[number];

export type ContentRow<T = Record<string, unknown>> = {
  id: string;
  type: ContentType;
  slug: string;
  sort_order: number;
  published: boolean;
  data: T;
  created_at: string;
  updated_at: string;
};

export const keywordKinds = ["target", "trending"] as const;
export const keywordStatuses = ["planned", "optimised", "ranking"] as const;

export type KeywordRow = {
  id: string;
  term: string;
  kind: (typeof keywordKinds)[number];
  page: string;
  status: (typeof keywordStatuses)[number];
  position: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type PageSpeedRow = {
  id: string;
  path: string;
  strategy: "mobile" | "desktop";
  scores: Record<string, number>;
  metrics: Record<string, string>;
  opportunities: { title: string; savings: string }[];
  created_at: string;
  updated_at: string;
};

export type Tables = {
  leads: LeadRow;
  applications: ApplicationRow;
  content: ContentRow;
  keywords: KeywordRow;
  pagespeed: PageSpeedRow;
};
export type Table = keyof Tables;
