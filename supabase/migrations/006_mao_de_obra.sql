create table if not exists public.prestadores (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  name text not null,
  role text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  prestador_id uuid references public.prestadores(id) on delete set null,
  amount_cents bigint not null,
  payment_date date not null default current_date,
  status text not null default 'pago'
    check (status in ('pago', 'pendente', 'atrasado')),
  receipt_path text,
  notes text,
  created_at timestamptz default now()
);

alter table public.prestadores enable row level security;
alter table public.pagamentos enable row level security;

create policy "prestadores_all_own" on public.prestadores
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = prestadores.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = prestadores.obra_id and o.owner_id = auth.uid()
    )
  );

create policy "pagamentos_all_own" on public.pagamentos
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = pagamentos.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = pagamentos.obra_id and o.owner_id = auth.uid()
    )
  );

create index if not exists prestadores_obra_id_idx on public.prestadores(obra_id);
create index if not exists pagamentos_obra_id_idx on public.pagamentos(obra_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'comprovantes',
  'comprovantes',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

create policy "comprovantes_select_own" on storage.objects
  for select using (
    bucket_id = 'comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "comprovantes_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "comprovantes_delete_own" on storage.objects
  for delete using (
    bucket_id = 'comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
