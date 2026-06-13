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

-- Row-Level Security: visitors may INSERT only. Nobody can read the data
-- through the public API — you read it in the dashboard (Table Editor).
-- NOTE: must allow BOTH anon and authenticated — once a visitor signs in they
-- become the `authenticated` role, and an anon-only policy would block them.
alter table public.subscribers enable row level security;
alter table public.feedback    enable row level security;

drop policy if exists "anon can subscribe" on public.subscribers;
drop policy if exists "anyone can subscribe" on public.subscribers;
create policy "anyone can subscribe"
  on public.subscribers for insert to anon, authenticated with check (true);

drop policy if exists "anon can send feedback" on public.feedback;
drop policy if exists "anyone can send feedback" on public.feedback;
create policy "anyone can send feedback"
  on public.feedback for insert to anon, authenticated with check (true);

-- 3. Idea Library — requires an authenticated user (Supabase Auth)
create table if not exists public.ideas (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  description     text not null default '',
  status          text not null check (status in ('unscored', 'scored')) default 'unscored',
  scores          jsonb,
  composite_score numeric(4,2),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.ideas enable row level security;

drop policy if exists "Users can read their own ideas" on public.ideas;
create policy "Users can read their own ideas" on public.ideas
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ideas" on public.ideas;
create policy "Users can insert their own ideas" on public.ideas
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ideas" on public.ideas;
create policy "Users can update their own ideas" on public.ideas
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own ideas" on public.ideas;
create policy "Users can delete their own ideas" on public.ideas
  for delete using (auth.uid() = user_id);

-- 3a. Migration (v1.2.0): workflow status + planning workspace.
-- Safe to re-run; ALTERs are guarded with "if not exists".
alter table public.ideas
  add column if not exists workflow_status text not null default 'open';
alter table public.ideas
  drop constraint if exists ideas_workflow_status_check;
alter table public.ideas
  add constraint ideas_workflow_status_check
  check (workflow_status in ('open', 'wip', 'live', 'on_hold'));
alter table public.ideas
  add column if not exists workspace jsonb;

-- 3b. Migration (v1.3.0): archive + niche grouping.
alter table public.ideas
  add column if not exists archived boolean not null default false;
alter table public.ideas
  add column if not exists niche text not null default '';
