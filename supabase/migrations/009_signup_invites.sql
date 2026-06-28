create table if not exists public.signup_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token_hash text not null,
  hotmart_transaction_id text unique,
  buyer_name text,
  buyer_phone text,
  plan text not null default 'premium'
    check (plan in ('gratuito', 'mensal', 'premium')),
  consumed_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz default now()
);

alter table public.signup_invites enable row level security;

create index if not exists signup_invites_email_idx
  on public.signup_invites (lower(email));

create index if not exists signup_invites_token_hash_idx
  on public.signup_invites (token_hash);
