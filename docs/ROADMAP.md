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
| Migrations 001–009 | Concluído (009 = `signup_invites`; verificar remoto) |
| Onboarding perfil (`/onboarding`) | Concluído |
| Clima Open-Meteo (`ObraWeatherCard`) | Concluído |
| Unit tests (Vitest mappers) | Concluído |
| CI (lint, test, build) | Concluído |
| E2E Playwright (auth flow) | Concluído |
| Deploy Cloudflare + obrioai.app | Concluído |
| Favicon + ObrioMark fallback | Concluído |
| Headers de segurança (`public/_headers`) | Concluído |
| Documentação (`docs/`) | Concluído |

## Gap analysis

### O que funciona hoje

- Login em `/` (alias `/login`); redirect autenticado → `/onboarding` (perfil incompleto) ou `/dashboard`
- Wizard de perfil pós-login (`/onboarding`: nome, WhatsApp, foto opcional)
- Navegação completa entre módulos principais
- Layout responsivo mobile-first
- Auth real (login, cadastro OTP, signout POST, middleware)
- Obras persistidas no Supabase (listagem, wizard, seletor no AppShell)
- Lembretes, responsáveis, diário, compras e pagamentos com **formulários de criação**
- Relatórios com dados reais da obra ativa + export `.txt`
- Nav enxuto (7 itens); `/responsaveis` substitui `/trocar-obra`
- Dock IA e FAB WhatsApp ocultos por padrão (feature flags)
- `/api/ai/chat`, `/api/weather`, `/api/export/report`
- Clima real no dashboard via `ObraWeatherCard` + Open-Meteo (`/api/weather`)
- Perfil com dados reais e upload de avatar (bucket `avatars`)
- Limites de plano via tabela `subscriptions` no AppShell
- Dashboard agregando obra ativa + lembretes + diário + financeiro
- Troca de obra ativa com persistência em `localStorage`
- Wizard de nova obra (11 passos) persistindo no Supabase
- Dock de IA com placeholders contextuais por rota
- Deploy automático em push para `main` (Cloudflare Workers)

### O que ainda é stub / placeholder

- Export Excel em relatórios
- Sync Hotmart → `subscriptions.plan` (billing pós-sistema)
- Câmera/áudio (modal de permissão apenas)
- Recibos (PDF server-side)
- `/configuracoes` — toggles sem persistência
- Alterar/cancelar assinatura in-app (após conclusão do núcleo)

### Débitos técnicos prioritários

1. Hotmart billing: webhook atualiza plano após signup (fase pós-sistema)
2. Persistência parseada do dock IA (após Fase 2 ✅)
3. LGPD: política de privacidade, delete account, export de dados
4. Refatorar `AppShell` em subcomponentes
5. E2E expandido: criar lembrete autenticado

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
| Migrations 002–009 | Concluído |
| Onboarding perfil (`/onboarding`) | Concluído |
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

### F3 — IA e integrações (parcial)

**Objetivo:** Diferenciais do produto.

| Integração | Abordagem | Status |
|------------|-----------|--------|
| Assistente IA | `POST /api/ai/chat` + LLM | Stub sem `OPENAI_API_KEY`; dock oculto por flag |
| SmartCapture | OCR/extração de NF via IA | Pendente |
| WhatsApp | Business API ou provedor | Pendente (FAB oculto por flag) |
| Clima | Open-Meteo via `/api/weather` | Concluído no dashboard |
| Export | `.txt` via `/api/export/report` | Concluído; Excel pendente |
| Recibos | Geração PDF server-side | Pendente |

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
| Assinatura Hotmart (sync plano) | Pendente — após núcleo do produto |
| Monitoramento (Sentry) | Pendente |
| LGPD completa | Pendente |

**Critério de saída:** Deploy automático; plano pago funcional; uptime monitorado.

---

## Priorização sugerida (próximos 30 dias)

1. Hotmart billing: sync `subscriptions` após signup + ativar `NEXT_PUBLIC_SIGNUP_ENABLED`
2. Assistente IA com persistência parseada (dock via flag)
3. E2E expandido (obra + lembrete)
4. LGPD mínima (política + delete account)
5. Export Excel em relatórios

## Referências

- [PRODUCT.md](./PRODUCT.md)
- [DATA-MODEL.md](./DATA-MODEL.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [TESTING.md](./TESTING.md)
