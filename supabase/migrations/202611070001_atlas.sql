-- Run once in your Supabase project's SQL editor (or supabase db push).
create table if not exists public.study_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (octet_length(payload::text) <= 200000),
  updated_at timestamptz not null default now()
);
alter table public.study_progress enable row level security;
revoke all on public.study_progress from anon;
grant select, insert, update, delete on public.study_progress to authenticated;
create policy "Read own progress" on public.study_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own progress" on public.study_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.study_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own progress" on public.study_progress for delete to authenticated using ((select auth.uid()) = user_id);

-- Private rate counter. No direct table access from browsers.
create table if not exists public.tutor_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  requests integer not null default 0 check (requests >= 0),
  primary key (user_id, usage_day)
);
alter table public.tutor_daily_usage enable row level security;
revoke all on public.tutor_daily_usage from anon, authenticated;
-- Authenticated caller can consume only its own daily budget, at most 30 calls.
-- The conditional upsert is atomic under concurrent requests.
create or replace function public.consume_tutor_budget()
returns boolean language plpgsql security definer set search_path = '' as $$
declare affected integer;
begin
  if auth.uid() is null then return false; end if;
  insert into public.tutor_daily_usage (user_id, usage_day, requests)
  values (auth.uid(), (now() at time zone 'UTC')::date, 1)
  on conflict (user_id, usage_day) do update
    set requests = public.tutor_daily_usage.requests + 1
    where public.tutor_daily_usage.requests < 30;
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;
revoke all on function public.consume_tutor_budget() from public, anon;
grant execute on function public.consume_tutor_budget() to authenticated;
