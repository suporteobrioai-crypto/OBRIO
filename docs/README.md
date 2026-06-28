# Documentação — Obrio AI

Índice central da documentação do projeto.

## Visão geral

**Obrio AI** é um SaaS de gestão de obras e reformas. A raiz (`/`) é a tela de login; módulos autenticados usam Supabase com RLS. Monetização via **Hotmart** (sem checkout in-app). Deploy em Cloudflare Workers ([obrioai.app](https://obrioai.app)).

## Documentos

| Documento | Conteúdo |
|-----------|----------|
| [PRODUCT.md](./PRODUCT.md) | Visão de produto, personas, módulos, fluxos |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, pastas, hooks, middleware, Cloudflare |
| [ROUTES.md](./ROUTES.md) | Mapa de rotas, nav (7 itens), redirects, APIs |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Cores, tipografia, componentes Ui.tsx |
| [DATA-MODEL.md](./DATA-MODEL.md) | Schema Supabase + migrations 001–009 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Setup local, scripts, Hotmart/Resend dev |
| [INTEGRATIONS.md](./INTEGRATIONS.md) | Supabase, Hotmart, Resend, IA, clima, WhatsApp |
| [SECURITY.md](./SECURITY.md) | Auth, RLS, secrets, headers, LGPD |
| [TESTING.md](./TESTING.md) | Vitest, Playwright E2E, CI |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Cloudflare + checklist produção |
| [SETUP_ACCOUNTS.md](./SETUP_ACCOUNTS.md) | Contas Supabase, Cloudflare, Hotmart, Resend |
| [ROADMAP.md](./ROADMAP.md) | Fases F0–F4, gaps, prioridades |

## Cursor Agent Skills

Skills do projeto em `.cursor/skills/`:

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
| UI + nav enxuto | Implementado |
| Supabase Auth + DB + RLS | Integrado (migrations 001–009) |
| CRUD núcleo + formulários de captura | Integrado |
| Hotmart webhook + signup | Código pronto; secrets produção pendentes |
| Assinatura | Read-only + link Hotmart |
| Testes unitários + E2E | Vitest + Playwright |
| CI | `.github/workflows/ci.yml` |
| Deploy Cloudflare | `wrangler.jsonc` + `deploy.yml` → obrioai.app |

Última atualização: simplificação UX, captura real, Hotmart-only, docs sincronizados.
