create table if not exists public.diario_entries (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  entry_date date not null default current_date,
  author_name text,
  content text not null,
  tags text[] default '{}',
  weather_note text,
  attachment_paths text[] default '{}',
  created_at timestamptz default now()
);

alter table public.diario_entries enable row level security;

create policy "diario_entries_all_own" on public.diario_entries
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = diario_entries.obra_id and o.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.obras o
      where o.id = diario_entries.obra_id and o.owner_id = auth.uid()
    )
  );

create index if not exists diario_entries_obra_id_idx on public.diario_entries(obra_id);
create index if not exists diario_entries_entry_date_idx on public.diario_entries(entry_date);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diario-fotos',
  'diario-fotos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "diario_fotos_select_own" on storage.objects
  for select using (
    bucket_id = 'diario-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "diario_fotos_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'diario-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "diario_fotos_delete_own" on storage.objects
  for delete using (
    bucket_id = 'diario-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
