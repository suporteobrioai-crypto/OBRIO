---
name: obrio-features
description: Domínio de negócio e módulos do Obrio AI — obras, reformas, materiais, mão de obra, lembretes, planos. Use ao implementar features, validar regras de negócio ou interpretar rotas do app.
---

# Obrio AI — Domínio e Features

## Produto

SaaS brasileiro de **gestão de obras e reformas** com assistente IA para captura rápida (texto, foto, áudio) e lembretes (app + WhatsApp planejado).

Personas: dono da obra, responsável técnico, colaborador convidado.

## Módulos e rotas

| Módulo | Rota | Persistência |
|--------|------|--------------|
| Auth / Login | `/` | Supabase Auth |
| Onboarding perfil | `/onboarding` | `profiles` (nome, WhatsApp, avatar) |
| Dashboard | `/dashboard` | Hooks agregados + clima (`/api/weather`) |
| Obras | `/obras`, `/obras/nova` | Supabase |
| Diário | `/diario` | `createEntry` |
| Materiais | `/materiais` | `createCompra` |
| Mão de obra | `/mao-de-obra` | `createPagamento` + `createPrestador` |
| Responsáveis | `/responsaveis` | CRUD Supabase |
| Lembretes | `/lembretes` | CRUD + `createReminder` |
| Relatórios | `/relatorios` | Dados reais + export `.txt` |
| Perfil / Assinatura / Config | `/perfil`, `/assinatura`, `/configuracoes` | Perfil + subscription reais |
| Financeiro | `/financeiro` | Agrega hooks (órfã) |

Redirects legados: `/trocar-obra` → `/responsaveis`, `/equipe` → `/responsaveis`, `/clima`/`/recibos`/`/assistente` → `/dashboard`, `/login` → `/`.

Detalhe completo: `docs/ROUTES.md`

## Fluxo pós-login

1. Login em `/` → middleware verifica `profiles.full_name` + `profiles.whatsapp`
2. Perfil incompleto → `/onboarding` (wizard 3 passos)
3. Perfil completo → `/dashboard`
4. Cadastro de obra em `/obras/nova` é **opcional** (não bloqueia acesso ao app)

Lógica: `lib/auth/profile-onboarding.ts`, `lib/auth/post-login-path.ts`, `lib/supabase/middleware.ts`

## Obra ativa (contexto global)

- Seletor no `AppShell` — distinto da rota `/responsaveis`
- Persistência: `localStorage` key `obrio-active-project`
- Evento: `CustomEvent("obrio:project-change")`
- Hook: `useObraAtiva()`

## Planos e limites

Tabela `subscriptions` + `PLAN_LIMITS` em `lib/types/database.ts`. UI em `/perfil` e `/assinatura` via `useSubscription()`.

## Captura de dados

Prioridade: botões **+ Registrar** em Diário, Compras, Pagamentos e Lembretes (`CreateRecordPanel`).

Dock IA (`NEXT_PUBLIC_AI_DOCK_ENABLED=true`) chama `POST /api/ai/chat`.

## Feature flags

- `NEXT_PUBLIC_AI_DOCK_ENABLED` — default `false`
- `NEXT_PUBLIC_WHATSAPP_FAB_ENABLED` + `NEXT_PUBLIC_WHATSAPP_URL`

## Referências

- `docs/PRODUCT.md`
- `docs/ROUTES.md`
- `docs/DATA-MODEL.md`
- `docs/ROADMAP.md`
