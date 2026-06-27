# Obrio AI

MVP de gestão de obras e reformas — Next.js 14, Supabase e Cloudflare Workers (OpenNext).

## Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Auth & DB:** Supabase (`kvofxprsmzyxssjpyfmy`)
- **Deploy:** Cloudflare Workers via `@opennextjs/cloudflare`
- **Repositório:** [suporteobrioai-crypto/OBRIO](https://github.com/suporteobrioai-crypto/OBRIO)

## Setup local

Guia completo de contas: [docs/SETUP_ACCOUNTS.md](docs/SETUP_ACCOUNTS.md)

1. Copie `.env.example` para `.env.local` e preencha as chaves do Supabase.
2. Aplique a migration em `supabase/migrations/001_obrio_core.sql` (SQL Editor ou `supabase db push`).
3. Instale dependências e rode o dev server:

```bash
npm install
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build Next.js |
| `npm run preview` | Preview no runtime Workers |
| `npm run deploy` | Build e deploy na Cloudflare |

## Contas

- GitHub: `suporteobrioai-crypto/OBRIO`
- Cloudflare account: `3993b788758518b8ed046b055577f49d`
- Supabase: `https://kvofxprsmzyxssjpyfmy.supabase.co`

## CI/CD (Cloudflare Workers Builds)

1. Dashboard Cloudflare → Workers & Pages → Connect to Git → `suporteobrioai-crypto/OBRIO`
2. Build command: `npm run deploy`
3. Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
