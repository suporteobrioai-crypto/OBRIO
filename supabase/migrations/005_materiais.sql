create table if not exists public.compras (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  purchase_date date not null default current_date,
  supplier text,
  total_cents bigint not null default 0,
  nf_path text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.materiais (
  id uuid primary key default gen_random_uuid(),
  compra_id uuid references public.compras(id) on delete set null,
  obra_id uuid not null references public.obras(id) on delete cascade,
  name text not null,
  category text,
  qty numeric,
  unit text,
  amount_cents bigint default 0,
  warranty_until date,
  created_at timestamptz default now()
);

alter table public.compras enable row level security;
alter table public.materiais enable row level security;

create policy "compras_all_own" on public.compras
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = compras.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = compras.obra_id and o.owner_id = auth.uid()
    )
  );

create policy "materiais_all_own" on public.materiais
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = materiais.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = materiais.obra_id and o.owner_id = auth.uid()
    )
  );

create index if not exists compras_obra_id_idx on public.compras(obra_id);
create index if not exists materiais_obra_id_idx on public.materiais(obra_id);

create or replace function public.sync_obra_spent_from_compras()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.obras o
  set spent_cents = coalesce((
    select sum(c.total_cents) from public.compras c where c.obra_id = o.id
  ), 0),
  updated_at = now()
  where o.id = coalesce(new.obra_id, old.obra_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists compras_sync_spent on public.compras;
create trigger compras_sync_spent
  after insert or update or delete on public.compras
  for each row execute function public.sync_obra_spent_from_compras();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'notas-fiscais',
  'notas-fiscais',
  false,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

create policy "notas_fiscais_select_own" on storage.objects
  for select using (
    bucket_id = 'notas-fiscais'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "notas_fiscais_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'notas-fiscais'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "notas_fiscais_delete_own" on storage.objects
  for delete using (
    bucket_id = 'notas-fiscais'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
