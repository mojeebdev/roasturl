-- RoastURL: roasts table
create table if not exists public.roasts (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  score integer not null check (score >= 0 and score <= 100),
  summary text[] not null default '{}',
  verdict text not null,
  status text not null default 'success',
  created_at timestamptz default now() not null
);

-- Index for fast URL lookups
create index if not exists roasts_url_idx on public.roasts (url);
create index if not exists roasts_created_at_idx on public.roasts (created_at desc);

-- RLS: public read, service role write
alter table public.roasts enable row level security;

create policy "Public can read roasts"
  on public.roasts for select
  using (true);

create policy "Service role can insert"
  on public.roasts for insert
  with check (true);
