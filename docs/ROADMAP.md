# Roadmap — Obrio AI

Roadmap de evolução do MVP para produto em produção.

## Estado atual

| Item | Status |
|------|--------|
| UI de 20 rotas | Concluído |
| Design system Tailwind | Concluído |
| AppShell + navegação | Concluído |
| Login na raiz (`/`) | Concluído |
| Supabase Auth + middleware | Concluído |
| CRUD obras (Supabase + RLS) | Concluído |
| Hooks em `hooks/` | Concluído |
| Lembretes + responsáveis persistidos | Concluído |
| Diário, materiais, pagamentos (hooks + páginas) | Concluído |
| Perfil + limites de plano (`subscriptions`) | Concluído |
| `/financeiro` agregando compras + pagamentos | Concluído |
| Migrations 001–008 | Concluído (aplicadas no remoto) |
| Unit tests (Vitest mappers) | Concluído |
| CI (lint, test, build) | Concluído |
| E2E Playwright (auth flow) | Concluído |
| Deploy Cloudflare + obrioai.app | Concluído |
| Favicon + ObrioMark fallback | Concluído |
| Headers de segurança (`public/_headers`) | Concluído |
| Documentação (`docs/`) | Concluído |

## Gap analysis

### O que funciona hoje

- Login em `/` (alias `/login`); redirect autenticado → `/dashboard`
- Navegação completa entre módulos principais
- Layout responsivo mobile-first
- Auth real (login, cadastro OTP, signout POST, middleware)
- Obras persistidas no Supabase (listagem, wizard, seletor no AppShell)
- Lembretes e responsáveis persistidos (`/lembretes`, `/trocar-obra`)
- Diário, materiais e mão de obra consumindo hooks + RLS
- Perfil com dados reais e upload de avatar (bucket `avatars`)
- Limites de plano via tabela `subscriptions` no AppShell
- Dashboard agregando obra ativa + lembretes + diário + financeiro
- Troca de obra ativa com persistência em `localStorage`
- Wizard de nova obra (11 passos) persistindo no Supabase
- Dock de IA com placeholders contextuais por rota
- Deploy automático em push para `main` (Cloudflare Workers)

### O que ainda é stub / placeholder

- Export PDF/Excel em relatórios
- Assinatura Stripe (webhook)
- Assistente IA (envio simulado)
- Câmera/áudio (modal de permissão apenas)
- Recibos (download/print)
- `/clima`, `/equipe` — UI mock sem backend dedicado
- `/configuracoes`, `/assinatura` — toggles e planos sem Stripe

### Débitos técnicos prioritários (F3/F4)

1. Stripe webhook + enforcement de assinatura paga
2. Route handler IA (`/api/ai/chat`)
3. Resolver rotas órfãs (`/recibos`, `/clima`, `/equipe`) — nav ou fusão
4. Renomear `/trocar-obra` → `/responsaveis` (breaking change coordenado)
5. LGPD: política de privacidade, delete account, export de dados
6. Otimização RLS `(select auth.uid())` (performance)
7. E2E expandido: criar obra → lembrete

---

## Fases

### F0 — Fundação ✅

**Objetivo:** Base documentada e reprodutível.

- [x] Análise holística
- [x] Documentação completa em `docs/`
- [x] Skills em `.cursor/skills/`
- [x] README alinhado ao código
- [x] Assets (`favicon.svg`, ObrioMark fallback)
- [x] `.gitignore` verificado para `.env.local`

**Critério de saída:** Novo dev consegue rodar `npm run dev` e entender o projeto lendo `docs/`.

---

### F1 — Auth + banco de dados ✅

**Objetivo:** Usuário real, obras persistidas.

| Entrega | Status |
|---------|--------|
| `lib/supabase/client.ts` + `server.ts` | Concluído |
| `middleware.ts` | Concluído |
| Login/cadastro | Concluído |
| Migrations 002–008 | Concluído |
| CRUD obras | Concluído |
| Hook `useObraAtiva` | Concluído |

**Critério de saída:** Criar conta, login, criar obra, ver no dashboard com dados do Supabase.

---

### F2 — Módulos core persistidos ✅

**Objetivo:** Operação diária com dados reais.

| Módulo | Status |
|--------|--------|
| Diário | Concluído |
| Materiais | Concluído |
| Mão de obra | Concluído |
| Lembretes | Concluído |
| Responsáveis | Concluído |
| Perfil | Concluído |
| Financeiro (agregação) | Concluído |

**Critério de saída:** CRUD funcional nos módulos acima com RLS por `owner_id`.

---

### F3 — IA e integrações (pendente)

**Objetivo:** Diferenciais do produto.

| Integração | Abordagem |
|------------|-----------|
| Assistente IA | `app/api/ai/route.ts` + LLM |
| SmartCapture | OCR/extração de NF via IA |
| WhatsApp | Business API ou provedor |
| Clima | OpenWeather ou similar |
| Export | PDF + Excel |
| Recibos | Geração PDF server-side |

**Critério de saída:** Enviar mensagem no dock IA e receber resposta; lembrete via WhatsApp em staging.

---

### F4 — Produção (parcial ✅)

**Objetivo:** SaaS confiável e monetizado.

| Entrega | Status |
|---------|--------|
| Testes Vitest | Concluído |
| Testes Playwright (auth) | Concluído |
| CI/CD GitHub Actions | Concluído |
| Deploy Cloudflare + OpenNext | Concluído |
| Headers de segurança | Concluído |
| Assinatura Stripe | Pendente |
| Monitoramento (Sentry) | Pendente |
| LGPD completa | Pendente |

**Critério de saída:** Deploy automático; plano pago funcional; uptime monitorado.

---

## Priorização sugerida (próximos 30 dias)

1. Stripe Checkout + webhooks
2. Assistente IA (route handler + dock)
3. E2E expandido (obra + lembrete)
4. LGPD mínima (política + delete account)
5. Clima API real no dashboard

## Referências

- [PRODUCT.md](./PRODUCT.md)
- [DATA-MODEL.md](./DATA-MODEL.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TESTING.md](./TESTING.md)
