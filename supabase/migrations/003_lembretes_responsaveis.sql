create table if not exists public.lembretes (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  status text not null default 'pendente'
    check (status in ('pendente', 'concluido', 'adiado')),
  priority text check (priority in ('Alta', 'Media', 'Baixa')),
  channel text not null default 'app'
    check (channel in ('app', 'whatsapp', 'ambos')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.responsaveis (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  status text not null default 'Pendente'
    check (status in ('Pendente', 'Ativo')),
  created_at timestamptz default now()
);

alter table public.lembretes enable row level security;
alter table public.responsaveis enable row level security;

create policy "lembretes_all_own" on public.lembretes
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = lembretes.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = lembretes.obra_id and o.owner_id = auth.uid()
    )
  );

create policy "responsaveis_all_own" on public.responsaveis
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = responsaveis.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = responsaveis.obra_id and o.owner_id = auth.uid()
    )
  );

create index if not exists lembretes_obra_id_idx on public.lembretes(obra_id);
create index if not exists lembretes_due_at_idx on public.lembretes(due_at);
create index if not exists responsaveis_obra_id_idx on public.responsaveis(obra_id);
