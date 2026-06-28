# Integrações — Obrio AI

Integrações externas: estado atual, arquitetura e pontos de entrada no código.

## Visão geral

```mermaid
flowchart LR
  App["Next.js App"]
  Supa["Supabase"]
  HM["Hotmart"]
  Resend["Resend"]
  AI["LLM API"]
  WA["WhatsApp"]
  Weather["Clima API"]
  Stripe["Stripe"]

  HM --> App
  App --> Supa
  App --> Resend
  App -.-> AI
  App -.-> WA
  App -.-> Weather
  App -.-> Stripe
```

| Integração | Estado | Prioridade |
|------------|--------|------------|
| Supabase Auth + DB | **Integrado** | P0 ✅ |
| Hotmart (pós-compra) | **Integrado** | P0 ✅ |
| Resend (email boas-vindas) | **Integrado** | P0 ✅ |
| Supabase Storage | **Integrado** (avatars, diário) | P1 ✅ |
| Assistente IA | Dock UI only | P1 |
| WhatsApp | FAB → config, copy only | P2 |
| Clima | Mock no dashboard/clima | P2 |
| Stripe (assinatura) | Stub UI + tabela `subscriptions` | P3 |

---

## Supabase ✅

### Auth

**Implementado:** `components/auth/AuthScreen.tsx` em `/` e `/login`, redirect `/cadastro`, `middleware.ts`, `app/auth/signout/route.ts`

| Fluxo pós-compra | Implementação |
|------------------|---------------|
| Compra Hotmart | `POST /api/webhooks/hotmart` |
| Email boas-vindas | Resend → link `/?mode=cadastro&email&token` |
| Cadastro | `POST /api/auth/signup` (email + senha + WhatsApp, sem OTP) |
| Pós-cadastro | Aba Entrar na mesma tela (sem auto-login) |
| Login | `signInWithPassword` → onboarding via `post-login-path` |

Login: `signInWithPassword` → `/obras/nova` ou `/dashboard`.

Logout: POST `/auth/signout` → redirect `/`.

### Client setup

```
lib/supabase/
├── client.ts    # createBrowserClient
├── server.ts    # createServerClient + cookies
├── middleware.ts
└── env.ts       # URL + ANON_KEY ou PUBLISHABLE_KEY
```

Variáveis: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)

### Database

Migrations `001`–`008` em `supabase/migrations/` — aplicadas no remoto.

Tabelas principais: `profiles`, `obras`, `lembretes`, `responsaveis`, `diario_entries`, `compras`, `materiais`, `prestadores`, `pagamentos`, `subscriptions`.

Ver [DATA-MODEL.md](./DATA-MODEL.md).

### Storage

| Módulo | Bucket / uso |
|--------|--------------|
| Perfil | `avatars` — upload avatar |
| Diário | Fotos de obra (paths por user/obra) |

Buckets com RLS por owner.

### Realtime (opcional)

Subscriptions em lembretes ou colaboração — Fase 3+.

---

## Assistente IA (pendente)

### UI atual

- Dock global em `AppShell.tsx` (`showObrioInput`)
- Página `/assistente`
- Placeholders contextuais por rota
- Envio simulado (notice string)

### Arquitetura alvo

```
Browser → POST /app/api/ai/chat → LLM provider
                ↓
         Context: obra_id, módulo, histórico
```

**Opções:** OpenAI, Anthropic, Vercel AI SDK, Cloudflare Workers AI

---

## WhatsApp (pendente)

### UI atual

- `WhatsAppIcon` component
- FAB no AppShell → `/configuracoes`
- Campo número WhatsApp em configurações e perfil

### Arquitetura alvo

Lembretes diários, alertas clima, OTP alternativo via WhatsApp Business API.

---

## Clima (pendente)

### UI atual

- Widget mock no `/dashboard`
- Página `/clima` — previsão 7 dias estática

### Arquitetura alvo

- API: OpenWeatherMap ou INMET
- Cache por cidade da obra
- Route Handler: `app/api/weather/route.ts`

---

## Hotmart + Resend ✅

### Fluxo pós-compra

```
Hotmart PURCHASE_COMPLETE → POST /api/webhooks/hotmart
  → signup_invites + token
  → Resend (purchase-welcome)
  → link https://obrioai.app/?mode=cadastro&email&token
Usuário cadastra → POST /api/auth/signup → aba Entrar → login
```

### Arquivos

| Arquivo | Função |
|---------|--------|
| `app/api/webhooks/hotmart/route.ts` | Webhook |
| `app/api/auth/signup/route.ts` | Cadastro server-side |
| `lib/hotmart/parse-event.ts` | Parser payload |
| `lib/email/send-purchase-welcome.ts` | Envio Resend |
| `scripts/create-test-invite.ts` | Invite manual para testes |

### Configuração Hotmart

1. Ferramentas → Webhook → URL `https://obrioai.app/api/webhooks/hotmart`
2. Eventos: Compra aprovada, Compra completa
3. Copiar Hottok → secret `HOTMART_HOTTOK`

### Configuração Resend

1. Verificar domínio `obrioai.app` (SPF/DKIM)
2. `RESEND_API_KEY` + `EMAIL_FROM`

---

## Pagamentos / Assinatura (parcial)

### UI atual

- `/assinatura` — planos Gratuito, Mensal, Premium
- Limites via tabela `subscriptions` + hook `useSubscription`

### Pendente (Stripe)

```
/assinatura → Stripe Checkout Session
Webhook → app/api/webhooks/stripe/route.ts
         → atualiza subscriptions
```

---

## Export PDF / Excel (pendente)

### UI atual

- `/relatorios` — botões PDF e Excel (stub)
- `/recibos` — download, print (stub)

---

## Referências

- [DATA-MODEL.md](./DATA-MODEL.md)
- [SECURITY.md](./SECURITY.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- `.env.example`
