# Integrações — Obrio AI

Integrações externas: estado atual, arquitetura e pontos de entrada no código.

## Visão geral

```mermaid
flowchart LR
  App["Next.js App"]
  Supa["Supabase"]
  AI["LLM API"]
  WA["WhatsApp"]
  Weather["Clima API"]
  Stripe["Stripe"]

  App --> Supa
  App -.-> AI
  App -.-> WA
  App -.-> Weather
  App -.-> Stripe
```

| Integração | Estado | Prioridade |
|------------|--------|------------|
| Supabase Auth + DB | **Integrado** | P0 ✅ |
| Supabase Storage | **Integrado** (avatars, diário) | P1 ✅ |
| Assistente IA | Dock UI only | P1 |
| WhatsApp | FAB → config, copy only | P2 |
| Clima | Mock no dashboard/clima | P2 |
| Stripe (assinatura) | Stub UI + tabela `subscriptions` | P3 |

---

## Supabase ✅

### Auth

**Implementado:** `app/page.tsx` (login), `app/login/page.tsx`, `app/cadastro/page.tsx`, `middleware.ts`, `app/auth/signout/route.ts`

| Fluxo cadastro | Implementação |
|----------------|---------------|
| Email | `signInWithOtp` |
| Código | `verifyOtp` |
| Senha | `updateUser({ password })` |
| Perfil | Upsert em `profiles` |

Login: `signInWithPassword` → redirect `/dashboard`.

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
