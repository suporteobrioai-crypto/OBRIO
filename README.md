# Obrio AI

MVP de gestão de obras e reformas com assistente inteligente — mercado brasileiro.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Estilo | Tailwind CSS 3, lucide-react |
| Backend | Supabase (Auth, Postgres, Storage, RLS) |
| Monetização | Hotmart (webhook + Resend) — sem pagamento in-app |
| Deploy | Cloudflare Workers + OpenNext |

## Estado do projeto

| Área | Status |
|------|--------|
| UI (rotas principais + redirects legados) | Implementado |
| Supabase (Auth, DB, hooks, CRUD núcleo) | Integrado |
| Captura (diário, compras, pagamentos, lembretes) | Formulários + hooks |
| Nav enxuto (7 itens) + `/responsaveis` | Implementado |
| Onboarding perfil pós-login (`/onboarding`) | Implementado |
| Relatórios | Dados reais da obra ativa + export `.txt` |
| Clima | Open-Meteo via `/api/weather` no dashboard |
| Hotmart + Resend (cadastro pós-compra) | Código pronto; migration `009` + secrets |
| Assinatura | Read-only (`useSubscription`) + link Hotmart |
| Dock IA / FAB WhatsApp | Ocultos por padrão (feature flags) |
| Testes unitários | Vitest (`npm test`) |
| Testes E2E | Playwright (`npm run test:e2e`) |
| CI/CD | GitHub Actions (lint, test, build, deploy) |
| Produção | [obrioai.app](https://obrioai.app) |

## Setup local

```bash
npm install
cp .env.example .env.local   # Supabase + flags opcionais
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — a raiz é a tela de login.

### Cadastro pós-compra (opcional, local)

```env
NEXT_PUBLIC_SIGNUP_ENABLED=true
HOTMART_HOTTOK=dev-token-local
SIGNUP_TOKEN_SECRET=...
RESEND_API_KEY=...
SUPABASE_SECRET_KEY=...
```

Testes: `npx tsx scripts/create-test-invite.ts email@exemplo.com --send-email`  
Webhook simulado: `npx tsx scripts/simulate-hotmart-webhook.ts email@exemplo.com`

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

## Supabase

Migrations `001`–`009` em `supabase/migrations/`. Aplicar no remoto:

```bash
npx supabase db push --linked
```

Projeto: `kvofxprsmzyxssjpyfmy` · Dashboard: [supabase.com/dashboard](https://supabase.com/dashboard/project/kvofxprsmzyxssjpyfmy/settings/api)

## Repositório

[github.com/suporteobrioai-crypto/OBRIO](https://github.com/suporteobrioai-crypto/OBRIO)

Deploy: ver [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).
