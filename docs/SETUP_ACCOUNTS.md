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
2. Copie **Project URL** e **anon key** para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvofxprsmzyxssjpyfmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

3. SQL Editor → cole e execute `supabase/migrations/001_obrio_core.sql`
4. Authentication → Providers → Email: habilitado
5. Authentication → URL Configuration → adicionar:
   - `http://localhost:3000/**`
   - `https://obrio-ai.<seu-subdominio>.workers.dev/**`

## 3. Cloudflare — login e deploy

```powershell
npx wrangler login
# Login com suporteobrioai@gmail.com na conta 3993b788758518b8ed046b055577f49d

npm run deploy
```

### Workers Builds (CI automático)

1. https://dash.cloudflare.com/3993b788758518b8ed046b055577f49d/workers-and-pages
2. Create → Connect to Git → `suporteobrioai-crypto/OBRIO`
3. Build command: `npm run deploy`
4. Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### GitHub Actions (alternativa)

Em https://github.com/suporteobrioai-crypto/OBRIO/settings/secrets/actions:

- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Teste local

```powershell
npm run dev
```

1. `/cadastro` → email → OTP → senha → WhatsApp
2. `/login` → entrar
3. `/obras/nova` → criar obra → ver em `/obras`
