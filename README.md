# Obrio AI

MVP de gestão de obras e reformas com assistente inteligente — mercado brasileiro.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Estilo | Tailwind CSS 3, lucide-react |
| Backend | Supabase (Auth, Postgres, Storage, RLS) |
| Deploy | Cloudflare Workers + OpenNext |

## Estado do projeto

| Área | Status |
|------|--------|
| UI (20 rotas) | Implementado |
| Supabase (Auth, DB, hooks) | Integrado |
| Auth / middleware | Login em `/`, proteção de rotas, signout |
| Testes unitários | Vitest (`npm test`) |
| Testes E2E | Playwright (`npm run test:e2e`) |
| CI/CD | GitHub Actions (lint, test, build, deploy) |
| Produção | [obrioai.app](https://obrioai.app) |

## Setup local

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — a raiz é a tela de login.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build de produção |
| `npm run start` | Servidor após build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (unit) |
| `npm run test:e2e` | Playwright (requer credenciais E2E) |
| `npm run deploy` | Build OpenNext + deploy Cloudflare |

## Documentação

Documentação completa em **[docs/](./docs/README.md)**:

- [Produto](./docs/PRODUCT.md) · [Arquitetura](./docs/ARCHITECTURE.md) · [Rotas](./docs/ROUTES.md)
- [Design System](./docs/DESIGN-SYSTEM.md) · [Modelo de Dados](./docs/DATA-MODEL.md)
- [Desenvolvimento](./docs/DEVELOPMENT.md) · [Integrações](./docs/INTEGRATIONS.md)
- [Segurança](./docs/SECURITY.md) · [Testes](./docs/TESTING.md) · [Deploy](./docs/DEPLOYMENT.md)
- [Roadmap](./docs/ROADMAP.md)

## Cursor Agent Skills

Skills do projeto em `.cursor/skills/` para guiar desenvolvimento com IA:

- `obrio-conventions` — convenções de código
- `obrio-ui` — design system e páginas
- `obrio-supabase` — Auth, DB, RLS
- `obrio-features` — domínio construção civil

## Supabase

1. Copie `.env.example` → `.env.local`
2. Migrations `001`–`008` em `supabase/migrations/` (aplicadas no remoto via `supabase db push`)

Projeto: `kvofxprsmzyxssjpyfmy` · Dashboard: [supabase.com/dashboard](https://supabase.com/dashboard/project/kvofxprsmzyxssjpyfmy/settings/api)

## Repositório

[github.com/suporteobrioai-crypto/OBRIO](https://github.com/suporteobrioai-crypto/OBRIO)

Deploy: ver [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).
