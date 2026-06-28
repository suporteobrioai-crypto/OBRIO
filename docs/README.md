# Documentação — Obrio AI

Índice central da documentação do projeto.

## Visão geral

**Obrio AI** é um SaaS de gestão de obras e reformas. A raiz (`/`) é a tela de login; módulos autenticados usam Supabase com RLS. Deploy em Cloudflare Workers ([obrioai.app](https://obrioai.app)).

## Documentos

| Documento | Conteúdo |
|-----------|----------|
| [PRODUCT.md](./PRODUCT.md) | Visão de produto, personas, módulos, fluxos |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, pastas, hooks, middleware, Cloudflare |
| [ROUTES.md](./ROUTES.md) | Mapa de 20 rotas, nav, status integrado/stub |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Cores, tipografia, componentes Ui.tsx |
| [DATA-MODEL.md](./DATA-MODEL.md) | Schema Supabase + migrations 001–008 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Setup local, scripts, convenções |
| [INTEGRATIONS.md](./INTEGRATIONS.md) | Supabase, IA, WhatsApp, clima, pagamentos |
| [SECURITY.md](./SECURITY.md) | Auth, RLS, secrets, headers, LGPD |
| [TESTING.md](./TESTING.md) | Vitest, Playwright E2E, CI |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Cloudflare + checklist produção |
| [ROADMAP.md](./ROADMAP.md) | Fases F0–F4, gaps, prioridades |

## Cursor Agent Skills

Skills do projeto em `.cursor/skills/` (guia o agente de IA do Cursor):

| Skill | Quando usar |
|-------|-------------|
| `obrio-conventions` | Convenções TypeScript/React do repo |
| `obrio-ui` | Design system e padrões de página |
| `obrio-supabase` | Auth, queries, migrations, RLS |
| `obrio-features` | Domínio construção civil e regras de negócio |

## Leitura recomendada

### Novo desenvolvedor

1. [DEVELOPMENT.md](./DEVELOPMENT.md) — rodar o projeto
2. [ARCHITECTURE.md](./ARCHITECTURE.md) — entender a estrutura
3. [ROUTES.md](./ROUTES.md) — mapa de funcionalidades
4. [ROADMAP.md](./ROADMAP.md) — o que falta fazer

### Product / design

1. [PRODUCT.md](./PRODUCT.md)
2. [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)

### Backend / Supabase

1. [DATA-MODEL.md](./DATA-MODEL.md)
2. [INTEGRATIONS.md](./INTEGRATIONS.md)
3. [SECURITY.md](./SECURITY.md)

## Estado do repositório

| Área | Status |
|------|--------|
| UI (20 rotas) | Implementado |
| Supabase Auth + DB + RLS | Integrado (migrations 001–008 aplicadas) |
| Hooks em `hooks/` | Integrado |
| Testes unitários | Vitest |
| Testes E2E | Playwright |
| CI | `.github/workflows/ci.yml` |
| Deploy Cloudflare | `wrangler.jsonc` + `deploy.yml` → obrioai.app |

Última atualização: sincronização docs + produção (F4 parcial).
