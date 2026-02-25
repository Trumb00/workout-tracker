-- ============================================================
-- WORKOUT TRACKER — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  created_at    timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- WORKOUT TEMPLATES
-- ============================================================
create table public.workout_templates (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('gym', 'cardio', 'custom')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- TEMPLATE ITEMS
-- ============================================================
create table public.template_items (
  id                  uuid primary key default gen_random_uuid(),
  template_id         uuid not null references public.workout_templates(id) on delete cascade,
  position            integer not null default 0,
  exercise_name       text not null,
  target_sets         integer,
  target_reps         integer,
  target_weight_kg    numeric(6,2),
  target_distance_km  numeric(6,3),
  target_duration_sec integer,
  custom_metric_name  text,
  custom_metric_unit  text
);

-- ============================================================
-- WORKOUT SESSIONS
-- ============================================================
create table public.workout_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  template_id  uuid references public.workout_templates(id) on delete set null,
  name         text not null,
  type         text not null check (type in ('gym', 'cardio', 'custom')),
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  notes        text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- SESSION EXERCISES
-- ============================================================
create table public.session_exercises (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_name  text not null,
  position       integer not null default 0,
  notes          text
);

-- ============================================================
-- SETS
-- ============================================================
create table public.sets (
  id                   uuid primary key default gen_random_uuid(),
  session_exercise_id  uuid not null references public.session_exercises(id) on delete cascade,
  set_number           integer not null,
  reps                 integer,
  weight_kg            numeric(6,2),
  completed            boolean not null default true,
  created_at           timestamptz not null default now()
);

-- ============================================================
-- CARDIO LOGS
-- ============================================================
create table public.cardio_logs (
  id                   uuid primary key default gen_random_uuid(),
  session_exercise_id  uuid not null references public.session_exercises(id) on delete cascade,
  distance_km          numeric(7,3),
  duration_sec         integer,
  pace_sec_per_km      numeric(8,2) generated always as (
    case when distance_km > 0
    then duration_sec::numeric / distance_km
    else null end
  ) stored
);

-- ============================================================
-- CUSTOM METRIC LOGS
-- ============================================================
create table public.custom_metric_logs (
  id                   uuid primary key default gen_random_uuid(),
  session_exercise_id  uuid not null references public.session_exercises(id) on delete cascade,
  metric_name          text not null,
  metric_value         numeric,
  metric_unit          text
);

-- ============================================================
-- PERSONAL RECORDS
-- ============================================================
create table public.personal_records (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  exercise_name         text not null,
  type                  text not null check (type in ('gym', 'cardio')),
  best_weight_kg        numeric(6,2),
  best_reps             integer,
  best_1rm_kg           numeric(6,2),
  best_distance_km      numeric(7,3),
  best_pace_sec_per_km  numeric(8,2),
  best_duration_sec     integer,
  achieved_at           timestamptz,
  session_id            uuid references public.workout_sessions(id) on delete set null,
  updated_at            timestamptz not null default now(),
  unique (user_id, exercise_name, type)
);

-- ============================================================
-- RLS POLICIES
-- ============================================================
alter table public.profiles             enable row level security;
alter table public.workout_templates    enable row level security;
alter table public.template_items       enable row level security;
alter table public.workout_sessions     enable row level security;
alter table public.session_exercises    enable row level security;
alter table public.sets                 enable row level security;
alter table public.cardio_logs          enable row level security;
alter table public.custom_metric_logs   enable row level security;
alter table public.personal_records     enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own templates"
  on public.workout_templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own template items"
  on public.template_items for all
  using (
    exists (
      select 1 from public.workout_templates t
      where t.id = template_id and t.user_id = auth.uid()
    )
  );

create policy "Users manage own sessions"
  on public.workout_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own session exercises"
  on public.session_exercises for all
  using (
    exists (
      select 1 from public.workout_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

create policy "Users manage own sets"
  on public.sets for all
  using (
    exists (
      select 1 from public.session_exercises se
      join public.workout_sessions s on s.id = se.session_id
      where se.id = session_exercise_id and s.user_id = auth.uid()
    )
  );

create policy "Users manage own cardio logs"
  on public.cardio_logs for all
  using (
    exists (
      select 1 from public.session_exercises se
      join public.workout_sessions s on s.id = se.session_id
      where se.id = session_exercise_id and s.user_id = auth.uid()
    )
  );

create policy "Users manage own custom logs"
  on public.custom_metric_logs for all
  using (
    exists (
      select 1 from public.session_exercises se
      join public.workout_sessions s on s.id = se.session_id
      where se.id = session_exercise_id and s.user_id = auth.uid()
    )
  );

create policy "Users manage own PRs"
  on public.personal_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- PR REFRESH FUNCTIONS
-- ============================================================
create or replace function public.refresh_gym_prs(p_session_id uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.personal_records (
    user_id, exercise_name, type,
    best_weight_kg, best_reps, best_1rm_kg,
    achieved_at, session_id, updated_at
  )
  select
    s.user_id,
    se.exercise_name,
    'gym',
    st.weight_kg,
    st.reps,
    round(st.weight_kg * (1 + st.reps::numeric / 30), 2),
    s.started_at,
    s.id,
    now()
  from public.sets st
  join public.session_exercises se on se.id = st.session_exercise_id
  join public.workout_sessions s on s.id = se.session_id
  where s.id = p_session_id
    and st.completed = true
    and st.weight_kg is not null
    and st.reps is not null
  on conflict (user_id, exercise_name, type) do update set
    best_weight_kg = case
      when excluded.best_1rm_kg > coalesce(personal_records.best_1rm_kg, 0)
      then excluded.best_weight_kg else personal_records.best_weight_kg end,
    best_reps = case
      when excluded.best_1rm_kg > coalesce(personal_records.best_1rm_kg, 0)
      then excluded.best_reps else personal_records.best_reps end,
    best_1rm_kg = greatest(excluded.best_1rm_kg, coalesce(personal_records.best_1rm_kg, 0)),
    achieved_at = case
      when excluded.best_1rm_kg > coalesce(personal_records.best_1rm_kg, 0)
      then excluded.achieved_at else personal_records.achieved_at end,
    session_id = case
      when excluded.best_1rm_kg > coalesce(personal_records.best_1rm_kg, 0)
      then excluded.session_id else personal_records.session_id end,
    updated_at = now();
end;
$$;

create or replace function public.refresh_cardio_prs(p_session_id uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.personal_records (
    user_id, exercise_name, type,
    best_distance_km, best_pace_sec_per_km, best_duration_sec,
    achieved_at, session_id, updated_at
  )
  select
    s.user_id,
    se.exercise_name,
    'cardio',
    cl.distance_km,
    cl.pace_sec_per_km,
    cl.duration_sec,
    s.started_at,
    s.id,
    now()
  from public.cardio_logs cl
  join public.session_exercises se on se.id = cl.session_exercise_id
  join public.workout_sessions s on s.id = se.session_id
  where s.id = p_session_id
    and cl.distance_km is not null
    and cl.duration_sec is not null
  on conflict (user_id, exercise_name, type) do update set
    best_distance_km = greatest(excluded.best_distance_km, coalesce(personal_records.best_distance_km, 0)),
    best_pace_sec_per_km = case
      when excluded.best_pace_sec_per_km < coalesce(personal_records.best_pace_sec_per_km, 999999)
      then excluded.best_pace_sec_per_km else personal_records.best_pace_sec_per_km end,
    best_duration_sec = case
      when excluded.best_pace_sec_per_km < coalesce(personal_records.best_pace_sec_per_km, 999999)
      then excluded.best_duration_sec else personal_records.best_duration_sec end,
    achieved_at = case
      when excluded.best_pace_sec_per_km < coalesce(personal_records.best_pace_sec_per_km, 999999)
      then excluded.achieved_at else personal_records.achieved_at end,
    session_id = case
      when excluded.best_pace_sec_per_km < coalesce(personal_records.best_pace_sec_per_km, 999999)
      then excluded.session_id else personal_records.session_id end,
    updated_at = now();
end;
$$;

-- ============================================================
-- INDEXES
-- ============================================================
create index on public.workout_sessions(user_id, started_at desc);
create index on public.session_exercises(session_id, position);
create index on public.sets(session_exercise_id, set_number);
create index on public.cardio_logs(session_exercise_id);
create index on public.personal_records(user_id, type);
