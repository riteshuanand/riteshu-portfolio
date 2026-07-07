-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text unique not null,
  type text not null check (type in ('case-study', 'teardown', 'writing')),
  summary text,
  body text,
  cover_url text,
  pdf_url text,
  tags text[] default '{}',
  metrics text,
  external_url text,
  sort_order integer not null default 0,
  published boolean not null default false
);

-- If you already ran an older version of this schema, add missing columns with:
-- alter table public.projects add column if not exists pdf_url text;
-- alter table public.projects add column if not exists sort_order integer not null default 0;

-- Key/value store for site copy — lets every heading and paragraph be edited from /admin
create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public read site content"
  on public.site_content for select
  using (true);

create policy "Auth write site content"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

alter table public.projects enable row level security;

-- Anyone can read published projects
create policy "Public read published"
  on public.projects for select
  using (published = true);

-- Logged-in user (you) can do everything
create policy "Auth full access"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for cover images (also used as card thumbnails)
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- Storage bucket for project PDFs
insert into storage.buckets (id, name, public)
values ('docs', 'docs', true)
on conflict (id) do nothing;

create policy "Public read covers"
  on storage.objects for select
  using (bucket_id = 'covers');

create policy "Auth upload covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'covers');

create policy "Auth update covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'covers');

create policy "Public read docs"
  on storage.objects for select
  using (bucket_id = 'docs');

create policy "Auth upload docs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'docs');

create policy "Auth update docs"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'docs');
