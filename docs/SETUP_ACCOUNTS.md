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
npm run dev
```

1. `/cadastro` → email → OTP → senha → WhatsApp
2. `/login` → entrar
3. `/obras/nova` → criar obra → ver em `/obras`

## 5. Teste produção

1. https://obrioai.app — home carrega com SSL
2. https://obrioai.app/login — auth funciona
3. https://obrioai.app/cadastro — callback retorna para obrioai.app
