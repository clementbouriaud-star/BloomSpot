-- BloomSpot minimal schema (frontend + Supabase)
-- Run this once in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ville text not null,
  surface text not null,
  loyer text not null,
  concept text not null,
  clientele text not null,
  atouts text[] not null default '{}'
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  questionnaire_id uuid not null references public.questionnaires(id) on delete cascade,
  title text not null,
  payload jsonb not null default '{}'::jsonb
);

alter table public.questionnaires enable row level security;
alter table public.reports enable row level security;

-- Temporary demo policies (anon frontend can insert/select).
-- Tighten these when auth is added.
drop policy if exists "demo questionnaires select" on public.questionnaires;
create policy "demo questionnaires select"
on public.questionnaires
for select
to anon, authenticated
using (true);

drop policy if exists "demo questionnaires insert" on public.questionnaires;
create policy "demo questionnaires insert"
on public.questionnaires
for insert
to anon, authenticated
with check (true);

drop policy if exists "demo reports select" on public.reports;
create policy "demo reports select"
on public.reports
for select
to anon, authenticated
using (true);

drop policy if exists "demo reports insert" on public.reports;
create policy "demo reports insert"
on public.reports
for insert
to anon, authenticated
with check (true);
