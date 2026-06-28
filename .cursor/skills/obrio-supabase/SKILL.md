---
name: obrio-supabase
description: Integração Supabase no Obrio AI — Auth, Postgres, RLS, Storage, hooks e migrations. Use ao conectar backend, criar queries, policies, middleware auth ou migrations.
---

# Obrio AI — Supabase

## Estado atual

- Clients: `lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- Middleware raiz protege rotas autenticadas
- Migrations: `001_obrio_core.sql` … `008_obra_members.sql`
- Hooks em `hooks/` — UI consome hooks, não Supabase diretamente
- Padrão: **browser client + RLS** (sem Server Actions para CRUD de domínio)

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvofxprsmzyxssjpyfmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # SERVER ONLY — nunca NEXT_PUBLIC_
```

Template: `.env.example`

## Hooks (ordem de integração)

| Hook | Tabela(s) | Migration |
|------|-----------|-----------|
| `useAuth` | auth | — |
| `useProfile` | profiles | 001, 007 |
| `useSubscription` | subscriptions | 007 |
| `useObras` / `useObraAtiva` | obras | 001, 002 |
| `useLembretes` | lembretes | 003 |
| `useResponsaveis` | responsaveis | 003 |
| `useDiario` | diario_entries | 004 |
| `useMateriais` | compras, materiais | 005 |
| `usePagamentos` | prestadores, pagamentos | 006 |

Obra ativa: `localStorage` key `obrio-active-project` + evento `obrio:project-change`.

## Migrations (aplicar em ordem)

```
supabase/migrations/
  001_obrio_core.sql
  002_obras_extend.sql
  003_lembretes_responsaveis.sql
  004_diario_storage.sql
  005_materiais.sql
  006_mao_de_obra.sql
  007_subscriptions.sql
  008_obra_members.sql
```

Aplicar: `supabase db push` ou SQL Editor. Documentar em `docs/DATA-MODEL.md`.

## Storage buckets

| Bucket | Path pattern | Migration |
|--------|--------------|-----------|
| diario-fotos | `{user_id}/{obra_id}/{entry_id}/{file}` | 004 |
| notas-fiscais | `{user_id}/{obra_id}/{file}` | 005 |
| comprovantes | `{user_id}/{obra_id}/{file}` | 006 |
| avatars | `{user_id}/avatar.{ext}` | 007 |

Usar signed URLs — buckets privados.

## RLS — regras

Tabelas com `owner_id` ou `id = auth.uid()`: profiles, obras, subscriptions.

**Tabelas filhas** com `obra_id`:

```sql
create policy "child_all_own" on public.<tabela>
  for all using (
    exists (
      select 1 from public.obras o
      where o.id = <tabela>.obra_id and o.owner_id = auth.uid()
    )
  );
```

## Auth flows

| UI | Implementação |
|----|---------------|
| `/login` | `signInWithPassword` |
| `/cadastro` | `signUp` + verify OTP |
| Logout AppShell | `POST /auth/signout` |
| Callback OAuth | `/auth/callback` |

## Limites de plano

`subscriptions.plan` → `PLAN_LIMITS` em `lib/types/database.ts`.  
AppShell bloqueia nova obra quando `obras.length >= limits.obraLimit`.

## Route handlers (server-only)

- `/auth/callback`, `/auth/signout` — feito
- Futuro: `/api/webhooks/stripe`, `/api/ai/chat`, `/api/export/pdf`

**Não** criar `app/api/obras/*` — RLS cobre via client.

## Queries — padrão

Preferir hooks; exemplo direto:

```typescript
const { data, error } = await supabase
  .from("obras")
  .select("*")
  .order("created_at", { ascending: false });
```

Erros: tratar `error` — não silenciar failures.

## Testes

- Unit: `npm test` — mappers em `lib/__tests__/`
- RLS manual: 2 usuários, user A não vê obras de B

## Referências

- `docs/DATA-MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `lib/types/database.ts`
