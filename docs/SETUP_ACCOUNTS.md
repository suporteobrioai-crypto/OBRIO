# Setup manual — contas suporteobrioai@gmail.com

Passos que exigem login no browser com **suporteobrioai@gmail.com**.

## 1. GitHub — push do código

A conta `gh` ativa (`maonamassaonlineapp-ai`) não tem permissão de push no repositório.

```powershell
gh auth login
# Escolha GitHub.com → HTTPS → Login com suporteobrioai@gmail.com

cd "c:\Users\ander\Documents\PROJETOS\Obrio-AI-programador-2026-06-11-1532"
git push -u origin main
```

Repositório: https://github.com/suporteobrioai-crypto/OBRIO

## 2. Supabase — migration e chaves

1. Abra https://supabase.com/dashboard/project/kvofxprsmzyxssjpyfmy/settings/api
2. Copie **Project URL**, **Publishable key** e **Secret key** para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvofxprsmzyxssjpyfmy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

3. SQL Editor → cole e execute `supabase/migrations/001_obrio_core.sql` (ou `supabase db push`)
4. Authentication → Providers → Email: habilitado
5. Authentication → URL Configuration:
   - **Site URL:** `https://obrioai.app`
   - **Redirect URLs:**
     - `http://localhost:3000/**`
     - `https://obrioai.app/**`
     - `https://www.obrioai.app/**`
     - `https://obrio-ai.obrioai.workers.dev/**`

Ou aplique via CLI: `supabase config push`

## 3. Cloudflare — login e deploy

**Domínio de produção:** https://obrioai.app  
**Worker (staging):** https://obrio-ai.obrioai.workers.dev

Custom domains configurados em `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "obrioai.app", "custom_domain": true },
  { "pattern": "www.obrioai.app", "custom_domain": true }
]
```

```powershell
npx wrangler login
# Login com suporteobrioai@gmail.com na conta 3993b788758518b8ed046b055577f49d

npm run deploy
```

### DNS parking — remover antes do custom domain

Se o deploy falhar com *"Hostname already has externally managed DNS records"*:

1. [DNS Records — obrioai.app](https://dash.cloudflare.com/3993b788758518b8ed046b055577f49d/obrioai.app/dns/records)
2. Apague registros **A**, **AAAA** ou **CNAME** em `obrioai.app` e `www.obrioai.app` (geralmente apontam para parking)
3. Rode `npm run deploy` ou `npx wrangler triggers deploy`

O `CLOUDFLARE_API_TOKEN` precisa de **Workers Scripts Edit** + **Zone DNS Edit** para o CI criar os registros automaticamente.

Alternativa: Workers → **obrio-ai** → Settings → Domains & Routes → **Add Custom Domain** → `obrioai.app` (após limpar DNS).

### Redirect www → apex (opcional)

Cloudflare Dashboard → **obrioai.app** → **Rules** → **Redirect Rules**:
- `www.obrioai.app/*` → `https://obrioai.app/$1` (301)

### Workers Builds (CI automático)

1. https://dash.cloudflare.com/3993b788758518b8ed046b055577f49d/workers-and-pages
2. Create → Connect to Git → `suporteobrioai-crypto/OBRIO`
3. Build command: `npm run deploy`
4. Variables (públicas, em wrangler.jsonc):
   - `NEXT_PUBLIC_SITE_URL` = `https://obrioai.app`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback legacy)

### GitHub Actions (alternativa)

Em https://github.com/suporteobrioai-crypto/OBRIO/settings/secrets/actions:

- `CLOUDFLARE_API_TOKEN` — precisa Workers Scripts Edit + Zone DNS Edit
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback legacy)

## 4. Teste local

```powershell
npm run dev -- -p 3000
```

1. **Invite + email Resend:** `npx tsx scripts/create-test-invite.ts voce@email.com --send-email`
2. **Webhook Hotmart simulado:** `npx tsx scripts/simulate-hotmart-webhook.ts voce@email.com`
3. Abrir link → cadastro (email + senha + WhatsApp) → aba Entrar → login
4. `/obras/nova` → criar obra → ver em `/obras`

Variáveis locais em `.env.local`: `NEXT_PUBLIC_SIGNUP_ENABLED=true`, `RESEND_API_KEY`, `EMAIL_FROM`, `HOTMART_HOTTOK` (dev), `SIGNUP_TOKEN_SECRET`.

Para dev, use `EMAIL_FROM=Obrio AI <onboarding@resend.dev>` até verificar `obrioai.app` no Resend.

## 5. Hotmart + Resend (produção)

1. Migration `009_signup_invites` aplicada no Supabase (`signup_invites`)
2. **Cloudflare Worker secrets** (`wrangler secret put` ou Dashboard → obrio-ai → Settings → Variables):
   - `HOTMART_HOTTOK` — token da Hotmart (Ferramentas → Webhook)
   - `SIGNUP_TOKEN_SECRET` — string longa aleatória (diferente do dev)
   - `RESEND_API_KEY`
   - `SUPABASE_SECRET_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY`)
   - `EMAIL_FROM` — ex. `Obrio AI <noreply@obrioai.app>` após domínio verificado
3. **Hotmart** → Ferramentas → Webhook → URL `https://obrioai.app/api/webhooks/hotmart`, evento compra aprovada
4. **Resend** → verificar domínio `obrioai.app` e usar remetente `@obrioai.app`
5. **Habilitar cadastro em produção:** `NEXT_PUBLIC_SIGNUP_ENABLED=true` em `wrangler.jsonc` e `.github/workflows/deploy.yml` (somente após Hotmart configurada)

## 6. Teste produção

1. https://obrioai.app — auth unificado (abas Entrar / Criar conta)
2. Compra teste Hotmart → email → cadastro → login → onboarding
