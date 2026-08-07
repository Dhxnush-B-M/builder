-- Core application data for a Supabase-native deployment.
--
-- `auth.users` is the source of truth for authentication. Do not recreate the
-- legacy Better Auth tables (`user`, `session`, `account`, etc.) in this schema.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text not null unique,
  display_username text not null unique,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  tags text[] not null default '{}',
  is_public boolean not null default false,
  is_locked boolean not null default false,
  password_hash text,
  stylesheet_revision integer not null default 0,
  render_data_version integer not null default 0,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create index resumes_user_updated_at_idx on public.resumes (user_id, updated_at desc);
create index resumes_public_slug_idx on public.resumes (is_public, slug);

create table public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  data jsonb not null,
  label text not null,
  created_at timestamptz not null default now()
);

create index resume_versions_resume_created_at_idx on public.resume_versions (resume_id, created_at desc);

create table public.resume_statistics (
  resume_id uuid primary key references public.resumes(id) on delete cascade,
  views integer not null default 0,
  downloads integer not null default 0,
  last_viewed_at timestamptz,
  last_downloaded_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.resume_statistics_daily (
  resume_id uuid not null references public.resumes(id) on delete cascade,
  date date not null,
  views integer not null default 0,
  downloads integer not null default 0,
  primary key (resume_id, date)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  company text not null,
  role text not null,
  location text,
  salary text,
  status text not null default 'saved',
  archived boolean not null default false,
  source text,
  source_url text,
  tags text[] not null default '{}',
  job_description text,
  match_score integer,
  ai_metadata jsonb,
  notes text,
  resume_file_url text,
  resume_file_name text,
  cover_letter_url text,
  cover_letter_name text,
  follow_up_at timestamptz,
  follow_up_note text,
  contacts jsonb not null default '[]',
  activity jsonb not null default '[]',
  applied_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_updated_at_idx on public.applications (user_id, updated_at desc);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, username, display_username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'username', replace(new.id::text, '-', '')),
    coalesce(new.raw_user_meta_data ->> 'display_username', new.raw_user_meta_data ->> 'username', replace(new.id::text, '-', ''))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_versions enable row level security;
alter table public.resume_statistics enable row level security;
alter table public.resume_statistics_daily enable row level security;
alter table public.applications enable row level security;

create policy "profiles are readable by everyone" on public.profiles for select using (true);
create policy "users update their profile" on public.profiles for update using ((select auth.uid()) = id);

create policy "owners manage resumes" on public.resumes for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Public resumes are intentionally served by an Edge Function. A direct public
-- select would expose `password_hash` and would bypass password verification.

create policy "owners manage resume versions" on public.resume_versions for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "owners read statistics" on public.resume_statistics for select using (
  exists (select 1 from public.resumes where resumes.id = resume_statistics.resume_id and resumes.user_id = (select auth.uid()))
);
create policy "owners read daily statistics" on public.resume_statistics_daily for select using (
  exists (select 1 from public.resumes where resumes.id = resume_statistics_daily.resume_id and resumes.user_id = (select auth.uid()))
);
create policy "owners manage applications" on public.applications for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public) values ('resume-assets', 'resume-assets', false)
on conflict (id) do nothing;

create policy "users manage their resume assets" on storage.objects for all
using (bucket_id = 'resume-assets' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'resume-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
