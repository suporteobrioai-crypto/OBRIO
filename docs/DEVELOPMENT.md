# Guia de Desenvolvimento — Obrio AI

## Pré-requisitos

- **Node.js** 20 LTS ou superior
- **npm** 9+
- Conta Supabase (projeto `kvofxprsmzyxssjpyfmy`)
- Editor com suporte TypeScript (VS Code / Cursor recomendado)

## Setup local

```bash
cd obrio-ai
npm install
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
# (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

npm run dev
```

App em **http://localhost:3000** — a raiz (`/`) é o login.

### Fase atual: login de teste

Por enquanto o foco é **entrar no app** com um usuário de teste. O cadastro pós-compra (Hotmart) fica desligado até a configuração final do Supabase.

**Mínimo no `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvofxprsmzyxssjpyfmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_SIGNUP_ENABLED=false
```

**Login:** abra `/`, informe email e senha de um usuário já criado no Supabase Auth (Authentication → Users).

**E2E / CI:** opcionalmente defina `E2E_USER_EMAIL` e `E2E_USER_PASSWORD` com o mesmo usuário de teste.

**Depois (fase Supabase):** migration `009_signup_invites`, webhook Hotmart, Resend, `NEXT_PUBLIC_SIGNUP_ENABLED=true`.

Migrations já aplicadas no remoto (001–008). A `009` fica para a fase pós-compra.

Para ambiente Supabase novo (fase final):

```bash
supabase db push --linked -p "SUA_SENHA_DB" --yes
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento Next.js |
| `npm run build` | Build de produção |
| `npm run start` | Servidor após build |
| `npm run lint` | ESLint |
| `npm test` | Vitest — `lib/__tests__/` |
| `npm run test:watch` | Vitest watch |
| `npm run test:e2e` | Playwright (requer credenciais E2E) |
| `npm run preview` | OpenNext preview (Cloudflare) |
| `npm run deploy` | Build + deploy Cloudflare |

## Variáveis de ambiente

Arquivo: `.env.local` (nunca commitar)

| Variável | Onde usar | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Sim* |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Alternativa ao ANON_KEY | Sim* |
| `NEXT_PUBLIC_SITE_URL` | URLs absolutas (prod) | Deploy |
| `SUPABASE_SERVICE_ROLE_KEY` | Server/admin only | Não no client |
| `E2E_USER_EMAIL` | Playwright / login de teste | E2E only |
| `E2E_USER_PASSWORD` | Playwright / login de teste | E2E only |
| `NEXT_PUBLIC_SIGNUP_ENABLED` | Exibe aba Criar conta | Não (default `false`) |

\* Uma das duas chaves publishable/anon.

Template: `.env.example`

## Estrutura e alias

`@/*` → raiz (`tsconfig.json`).

## Convenções de código

- TypeScript `strict: true`
- Identificadores em **inglês**; copy UI em **português**
- `"use client"` quando hooks/eventos/browser APIs
- Imports no topo do arquivo
- Switch unions: `default` com `never`

## Como adicionar uma nova página

1. Criar `app/nova-rota/page.tsx`
2. Se autenticada, envolver com `AppShell`
3. Dados: criar hook em `hooks/` + migration se necessário
4. Documentar em [ROUTES.md](./ROUTES.md)
5. Adicionar link em `navItems` se aplicável

## Assets estáticos

| Arquivo | Uso |
|---------|-----|
| `public/favicon.svg` | Favicon do app |
| `public/obrio-logo.png` | Opcional — ObrioMark usa fallback inline |
| `public/_headers` | Headers Cloudflare |

## Testes

```bash
npm test                    # unit
npm run test:e2e            # E2E (credenciais E2E no .env.local)
PLAYWRIGHT_BASE_URL=... npm run test:e2e   # contra URL externa
```

Ver [TESTING.md](./TESTING.md).

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | `npm run dev -- -p 3001` |
| Supabase não conecta | Verificar `.env.local` e restart |
| Build falha | `npm run lint` + corrigir TS |
| E2E skipped | Definir `E2E_USER_EMAIL` e `E2E_USER_PASSWORD` |

## Referências

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ROUTES.md](./ROUTES.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TESTING.md](./TESTING.md)
