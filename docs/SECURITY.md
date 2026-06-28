# Segurança — Obrio AI

Práticas de segurança para auth, dados, secrets e conformidade LGPD.

## Estado atual

| Controle | Status |
|----------|--------|
| Autenticação | **Implementado** — Supabase Auth (email + senha; cadastro pós-compra via API) |
| Proteção de rotas | **Implementado** — `middleware.ts` refresh + redirect |
| RLS Supabase | **Implementado** — migrations 001–009 |
| Logout | **Implementado** — POST `/auth/signout`, cookies limpos |
| HTTPS | Cloudflare (obrioai.app) |
| Headers | `public/_headers` (X-Frame-Options, nosniff, etc.) |
| Secrets no repo | Apenas `.env.example` — OK |
| Chaves em wrangler | Removidas — secrets via Dashboard/CI |

Rotas públicas: `/`, `/login`, `/cadastro`.

Rotas protegidas: todas as demais → redirect para `/` se sem sessão.

Usuário autenticado em `/`, `/login` ou `/cadastro` → `/onboarding` ou `/dashboard` conforme perfil.

---

## Autenticação

### Supabase Auth

- Email + senha no login
- Cadastro pós-compra: `POST /api/auth/signup` com token Hotmart (sem OTP)
- Session em cookies httpOnly via `@supabase/ssr`
- `SUPABASE_SECRET_KEY` apenas em route handlers (signup, webhook)

### Middleware

Implementado em `middleware.ts` + `lib/supabase/middleware.ts`:

- Refresh de session a cada request
- Redirect não autenticado → `/`
- Redirect autenticado em rotas auth → onboarding via `post-login-path`

### Logout

Modal no AppShell → form POST `/auth/signout` → `supabase.auth.signOut()` → redirect `/`.

---

## Row Level Security (RLS)

### Padrão

Toda entidade ligada a obra usa policy via `obras.owner_id = auth.uid()`:

```sql
using (
  exists (
    select 1 from public.obras o
    where o.id = <tabela>.obra_id
      and o.owner_id = auth.uid()
  )
)
```

### Tabelas com RLS

`profiles`, `obras`, `lembretes`, `responsaveis`, `diario_entries`, `compras`, `materiais`, `prestadores`, `pagamentos`, `subscriptions`.

### Colaboradores (`obra_members`)

Quando implementar equipe: policy adicional por `member_user_id` + role.

---

## Secrets e variáveis

| Variável | Exposição | Regra |
|----------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | OK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | OK (com RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Nunca `NEXT_PUBLIC_` |
| `CLOUDFLARE_API_TOKEN` | CI only | Nunca no client |
| API keys IA / WhatsApp | Server only | Route handlers |

### Checklist

- [x] `.env.local` no `.gitignore`
- [x] Supabase keys removidas de `wrangler.jsonc`
- [ ] Não logar tokens, senhas ou PII
- [ ] Service role só em scripts admin e webhooks
- [ ] Rotacionar keys se vazamento

---

## Validação de input

Nas fronteiras (forms, API routes futuras):

- Validar email, telefone BR, valores monetários
- Sanitizar uploads (MIME, tamanho)
- Allow-list de enums
- Rate limit em login e API IA (F4)

Biblioteca sugerida: `zod`

---

## Headers de segurança (produção)

Configurados em `public/_headers`:

| Header | Valor |
|--------|-------|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |

**HSTS:** Cloudflare SSL/TLS settings (Always Use HTTPS).

Cookies de session: `Secure`, `HttpOnly`, `SameSite=Lax` (Supabase SSR).

---

## Supabase Auth URLs

Documentar e manter atualizado no Dashboard:

- Site URL: `https://obrioai.app`
- Redirect: `https://obrioai.app/**`, `https://obrio-ai.obrioai.workers.dev/**`, `http://localhost:3000/**`

Ver [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## LGPD (pendente parcial)

### Dados pessoais tratados

Email, nome, telefone/WhatsApp, endereços de obra, fotos, NF, pagamentos.

### Obrigações pendentes

| Requisito | Status |
|-----------|--------|
| Consentimento + política | Pendente |
| Export de dados | Pendente |
| Delete account | Pendente |
| Storage privado | Parcial (avatars) |

---

## Checklist pré-produção

- [x] Middleware auth funcional
- [x] RLS em migrations
- [x] Secrets fora do código/wrangler
- [x] Headers de segurança
- [x] HTTPS via Cloudflare
- [ ] RLS testado manualmente (2 usuários)
- [ ] Upload com validação de tipo/tamanho
- [ ] Política de privacidade publicada
- [ ] Fluxo de exclusão de conta

---

## Referências

- [INTEGRATIONS.md](./INTEGRATIONS.md)
- [DATA-MODEL.md](./DATA-MODEL.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- `supabase/migrations/`
- Skill: `.cursor/skills/obrio-supabase/SKILL.md`
