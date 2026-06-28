# Deploy — Obrio AI

Guia de deploy em produção: Cloudflare Workers + OpenNext, CI/CD e checklist operacional.

## Estado atual

| Item | Status |
|------|--------|
| `npm run build` | Next.js 15 |
| `npm run start` | Servidor Node após build |
| `npm run preview` | OpenNext preview local |
| `npm run deploy` | OpenNext + Wrangler deploy |
| `wrangler.jsonc` | Configurado (obrio-ai, obrioai.app) |
| `@opennextjs/cloudflare` | Instalado |
| CI | `.github/workflows/ci.yml` |
| Deploy automático | `.github/workflows/deploy.yml` (push `main`) |
| Domínio | [obrioai.app](https://obrioai.app) |
| Workers dev | [obrio-ai.obrioai.workers.dev](https://obrio-ai.obrioai.workers.dev) |

---

## Cloudflare Workers (caminho principal)

### Arquivos

| Arquivo | Função |
|---------|--------|
| `wrangler.jsonc` | Worker name, routes, assets, vars |
| `open-next.config.ts` | Adapter OpenNext |
| `public/_headers` | Headers de segurança + cache estático |

### Deploy manual

```bash
# Variáveis no shell ou Cloudflare Dashboard (secrets)
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=3993b788758518b8ed046b055577f49d
export NEXT_PUBLIC_SUPABASE_URL=...
export NEXT_PUBLIC_SUPABASE_ANON_KEY=...
export NEXT_PUBLIC_SITE_URL=https://obrioai.app

npm run deploy
```

### Secrets (nunca no `wrangler.jsonc`)

Configure no **Cloudflare Dashboard** → Workers → obrio-ai → Settings → Variables, ou via GitHub Actions secrets no deploy:

| Variável | Onde |
|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Build + runtime |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Build + runtime |
| `NEXT_PUBLIC_SITE_URL` | `https://obrioai.app` (também em `wrangler.jsonc` vars) |
| `CLOUDFLARE_API_TOKEN` | CI deploy only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (se route handlers precisarem) |

O `wrangler.jsonc` contém apenas `NEXT_PUBLIC_SITE_URL` em `vars` — chaves Supabase ficam em secrets.

---

## CI/CD (GitHub Actions)

### CI — `.github/workflows/ci.yml`

Em push e PR:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build` (com secrets Supabase)

Job E2E (apenas push em `main`):

1. Build + `npm run test:e2e` com `E2E_USER_EMAIL` / `E2E_USER_PASSWORD`

### Deploy — `.github/workflows/deploy.yml`

Em push para `main`:

1. lint → test → build (gate)
2. `npm run deploy` para Cloudflare

Secrets necessários no repositório GitHub:

| Secret | Uso |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Build |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Build (alternativa) |
| `CLOUDFLARE_API_TOKEN` | Deploy |
| `E2E_USER_EMAIL` | E2E (usuário dedicado Supabase) |
| `E2E_USER_PASSWORD` | E2E |

---

## Supabase Auth — URLs de redirect

Configurar manualmente no [Supabase Dashboard](https://supabase.com/dashboard/project/kvofxprsmzyxssjpyfmy/auth/url-configuration):

| Campo | Valor |
|-------|-------|
| Site URL | `https://obrioai.app` |
| Redirect URLs | `https://obrioai.app/**` |
| | `https://obrio-ai.obrioai.workers.dev/**` |
| | `http://localhost:3000/**` |

---

## Variáveis por ambiente

| Variável | Local | CI | Production |
|----------|-------|-----|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | .env.local | secrets | Cloudflare secrets |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | .env.local | secrets | Cloudflare secrets |
| `NEXT_PUBLIC_SITE_URL` | opcional | — | `https://obrioai.app` |
| `SUPABASE_SERVICE_ROLE_KEY` | .env.local | — | Server only |
| `E2E_USER_EMAIL` | .env.local | secrets | — |
| `E2E_USER_PASSWORD` | .env.local | secrets | — |

Nunca commitar `.env.local`.

---

## Build local de produção

```bash
npm run lint
npm test
npm run build
npm run start
# http://localhost:3000
```

---

## Headers de segurança

Via `public/_headers` (Cloudflare assets):

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**HSTS:** habilitar em Cloudflare SSL/TLS → Edge Certificates → Always Use HTTPS + HSTS (não duplicar no `_headers` se CF já injeta).

---

## Rollback

| Host | Ação |
|------|------|
| Cloudflare | Workers → Deployments → Rollback para build anterior |
| GitHub | Revert commit em `main` → redeploy automático |

---

## Checklist de produção — obrioai.app

### Supabase

- [ ] Migrations 001–008 aplicadas no projeto `kvofxprsmzyxssjpyfmy`
- [ ] RLS habilitado em todas as tabelas
- [ ] Auth URL Configuration (Site URL + Redirect URLs acima)
- [ ] Bucket `avatars` com policies de upload
- [ ] Usuário E2E criado para CI (`E2E_USER_EMAIL`)

### Cloudflare

- [ ] Worker `obrio-ai` deployado
- [ ] Domínio `obrioai.app` e `www.obrioai.app` apontando ao Worker
- [ ] Secrets Supabase configurados (não em `wrangler.jsonc`)
- [ ] SSL Full (strict) + HTTPS redirect
- [ ] HSTS via dashboard (opcional)

### GitHub

- [ ] Secrets configurados (Supabase, Cloudflare, E2E)
- [ ] CI passando em PR
- [ ] Deploy em `main` passa lint + test + build

### Smoke test pós-deploy

- [ ] `https://obrioai.app/` — formulário de login visível
- [ ] Login → redirect `/dashboard`
- [ ] Logo/favicon sem 404 (Network tab)
- [ ] Criar/listar obra no AppShell
- [ ] Logout → volta para `/`
- [ ] Headers de segurança presentes (DevTools → Response headers)

### Pendente pós-MVP

- [ ] Stripe webhooks em produção
- [ ] Sentry ou monitoramento de erros
- [ ] Política de privacidade publicada
- [ ] Fluxo delete account (LGPD)

---

## Opção alternativa — Vercel

Next.js funciona zero-config na Vercel se necessário para previews. O caminho oficial deste repo é Cloudflare Workers.

---

## Referências

- Repositório: [suporteobrioai-crypto/OBRIO](https://github.com/suporteobrioai-crypto/OBRIO)
- Supabase project: `kvofxprsmzyxssjpyfmy`
- [ROADMAP.md](./ROADMAP.md) — Fase F4
- [SECURITY.md](./SECURITY.md)
- [TESTING.md](./TESTING.md)
