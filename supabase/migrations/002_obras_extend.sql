alter table public.obras
  add column if not exists property_type text,
  add column if not exists area_sqm numeric,
  add column if not exists goals text[] default '{}';
