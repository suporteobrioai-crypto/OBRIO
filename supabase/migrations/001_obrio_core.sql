-- profiles (extensão de auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  whatsapp text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- obras (projetos de construção)
create table if not exists public.obras (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('Obra completa', 'Reforma')),
  status text not null default 'Ativa'
    check (status in ('Ativa', 'Pausada', 'Concluída', 'Arquivada')),
  city text,
  state text,
  address text,
  budget_cents bigint default 0,
  spent_cents bigint default 0,
  progress smallint default 0 check (progress between 0 and 100),
  start_date date,
  delivery_date date,
  responsible text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.obras enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "obras_all_own" on public.obras;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "obras_all_own" on public.obras
  for all using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
