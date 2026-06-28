create table if not exists public.obra_members (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  invite_email text,
  role text not null default 'viewer',
  permissions jsonb default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz default now()
);

alter table public.obra_members enable row level security;

create policy "obra_members_owner_all" on public.obra_members
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = obra_members.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = obra_members.obra_id and o.owner_id = auth.uid()
    )
  );

create policy "obra_members_self_select" on public.obra_members
  for select using (auth.uid() = user_id);

create index if not exists obra_members_obra_id_idx on public.obra_members(obra_id);
create index if not exists obra_members_user_id_idx on public.obra_members(user_id);
