-- The Idea Matrix — backend schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query →
-- paste → Run.

-- 1. Email list signups
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- 2. Feedback (feature requests + bug reports)
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('feature', 'bug')),
  message    text not null,
  created_at timestamptz not null default now()
);

-- Row-Level Security: anonymous visitors may INSERT only. Nobody can read the
-- data through the public API — you read it in the dashboard (Table Editor).
alter table public.subscribers enable row level security;
alter table public.feedback    enable row level security;

drop policy if exists "anon can subscribe" on public.subscribers;
create policy "anon can subscribe"
  on public.subscribers for insert to anon with check (true);

drop policy if exists "anon can send feedback" on public.feedback;
create policy "anon can send feedback"
  on public.feedback for insert to anon with check (true);
