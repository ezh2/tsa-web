do $$
begin
  create type public.academic_stage as enum (
    'freshman',
    'sophomore',
    'junior',
    'senior',
    'grad'
  );
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists netid text,
  add column if not exists phone_number text,
  add column if not exists personal_email text,
  add column if not exists academic_stage_start public.academic_stage,
  add column if not exists academic_stage_recorded_year integer;

create unique index if not exists profiles_netid_unique_idx
  on public.profiles (lower(netid))
  where netid is not null;

create or replace function public.tg_auth_user_create_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    netid,
    phone_number,
    personal_email,
    academic_stage_start,
    academic_stage_recorded_year
  )
  values (
    new.id,
    case
      when lower(new.email) like '%@illinois.edu' then lower(new.email)
      else null
    end,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', '')
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'first_name', ''),
      nullif(new.raw_user_meta_data ->> 'given_name', ''),
      nullif(split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1), '')
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'last_name', ''),
      nullif(new.raw_user_meta_data ->> 'family_name', ''),
      nullif(
        regexp_replace(new.raw_user_meta_data ->> 'full_name', '^\S+\s*', ''),
        ''
      )
    ),
    nullif(lower(new.raw_user_meta_data ->> 'netid'), ''),
    nullif(new.raw_user_meta_data ->> 'phone_number', ''),
    coalesce(
      nullif(lower(new.raw_user_meta_data ->> 'personal_email'), ''),
      case
        when lower(new.email) not like '%@illinois.edu' then lower(new.email)
        else null
      end
    ),
    case
      when new.raw_user_meta_data ->> 'academic_stage_start'
        in ('freshman', 'sophomore', 'junior', 'senior', 'grad')
      then (new.raw_user_meta_data ->> 'academic_stage_start')::public.academic_stage
      else null
    end,
    case
      when new.raw_user_meta_data ->> 'academic_stage_recorded_year' ~ '^[0-9]{4}$'
      then (new.raw_user_meta_data ->> 'academic_stage_recorded_year')::integer
      else null
    end
  );
  return new;
end;
$$;
