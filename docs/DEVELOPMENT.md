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

npm run dev
```

App em **http://localhost:3000** — a raiz (`/`) é o login.

### Mínimo no `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://kvofxprsmzyxssjpyfmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_SIGNUP_ENABLED=false
NEXT_PUBLIC_AI_DOCK_ENABLED=false
NEXT_PUBLIC_WHATSAPP_FAB_ENABLED=false
```

**Login de teste:** `/` → onboarding (primeira vez) → `/dashboard`.

**E2E:** `E2E_USER_EMAIL` e `E2E_USER_PASSWORD` no `.env.local`.

### Cadastro pós-compra (Hotmart + Resend)

Requer migration `009_signup_invites` aplicada no Supabase remoto:

```bash
npx supabase db push --linked
```

Variáveis adicionais:

```env
NEXT_PUBLIC_SIGNUP_ENABLED=true
HOTMART_HOTTOK=dev-token-local
SIGNUP_TOKEN_SECRET=string-longa-aleatoria
SUPABASE_SECRET_KEY=sb_secret_...
RESEND_API_KEY=re_...
EMAIL_FROM=Obrio AI <onboarding@resend.dev>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SIGNUP_ALLOW_OPEN=false
```

Testes locais:

```bash
npx tsx scripts/create-test-invite.ts seu@email.com --send-email
npx tsx scripts/simulate-hotmart-webhook.ts seu@email.com
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

Arquivo: `.env.local` (nunca commitar). Template completo: `.env.example`

| Variável | Onde usar | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Sim* |
| `NEXT_PUBLIC_SITE_URL` | URLs absolutas | Deploy / emails |
| `NEXT_PUBLIC_SIGNUP_ENABLED` | Aba Criar conta | Não (default `false`) |
| `NEXT_PUBLIC_SALES_PAGE_URL` | Link Hotmart na UI | Recomendado |
| `NEXT_PUBLIC_AI_DOCK_ENABLED` | Dock IA no AppShell | Não (default `false`) |
| `NEXT_PUBLIC_WHATSAPP_FAB_ENABLED` | FAB contato | Não (default `false`) |
| `SUPABASE_SECRET_KEY` | Webhook, signup API | Hotmart flow |
| `HOTMART_HOTTOK` | Valida webhook | Hotmart flow |
| `SIGNUP_TOKEN_SECRET` | Hash tokens invite | Hotmart flow |
| `RESEND_API_KEY` | Email pós-compra | Hotmart flow |
| `OPENAI_API_KEY` | `/api/ai/chat` | Opcional |

\* Ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

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

## Componentes de captura

- `CreateRecordPanel` — formulário reutilizável para create*
- Usado em: diário, materiais, pagamentos, lembretes

## Testes

```bash
npm test
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://obrioai.app npm run test:e2e   # contra produção
```

Ver [TESTING.md](./TESTING.md).

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | `npm run dev -- -p 3001` — **pare o outro `npm run dev` antes** |
| Tela sem estilo / 404 em `/_next/static` | Parar **todos** os `npm run dev`, apagar `.next` e `tsconfig.tsbuildinfo`, subir **um** `npm run dev`, hard refresh (`Ctrl+Shift+R`) |
| 500 Internal Server Error | Mesma causa do item acima (cache `.next` corrompido) |
| Supabase não conecta | Verificar `.env.local` e restart |
| Build falha | `npm run lint` + corrigir TS — rode `npm run build` com o dev **parado** |
| E2E skipped | Definir `E2E_USER_EMAIL` e `E2E_USER_PASSWORD` |
| Webhook 401 | `HOTMART_HOTTOK` no header `X-Hotmart-Hottok` |
| Resend 403 | Usar `onboarding@resend.dev` em dev |

### Um servidor dev por vez

Dois `next dev` (ex.: portas 3000 e 3001) no **mesmo** projeto compartilham a pasta `.next` e corrompem o cache webpack.

- Desenvolvimento: `npm run dev` em **http://localhost:3000**
- E2E local: pare o dev antes de `npm run test:e2e` (Playwright sobe `npm run start` na 3001) ou use `PLAYWRIGHT_BASE_URL` apontando para um único servidor já rodando

Ver também [TESTING.md](./TESTING.md).

## Referências

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ROUTES.md](./ROUTES.md)
- [INTEGRATIONS.md](./INTEGRATIONS.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TESTING.md](./TESTING.md)
