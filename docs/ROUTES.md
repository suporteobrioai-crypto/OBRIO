# Mapa de Rotas — Obrio AI

Referência completa das rotas do App Router (`app/`).

## Legenda de status

| Status | Significado |
|--------|-------------|
| **Integrado** | Conectado a Supabase via hooks ou client |
| **Stub** | Botão/ação visual sem backend real |
| **Redirect** | Rota legada redirecionada |

## Tabela de rotas

| Rota | Arquivo | AppShell | Nav | Status | Descrição |
|------|---------|----------|-----|--------|-----------|
| `/` | `app/page.tsx` | Não | — | Integrado | Auth unificado; autenticado → onboarding ou dashboard |
| `/login` | redirect | Não | — | Redirect | 301 → `/` |
| `/cadastro` | `app/cadastro/page.tsx` | Não | — | Redirect | Redireciona para `/?mode=cadastro` (se signup habilitado) |
| `/onboarding` | `app/onboarding/page.tsx` | Não | — | Integrado | Wizard perfil pós-login |
| `/dashboard` | `app/dashboard/page.tsx` | Sim | Sim | Integrado | Hub: métricas reais, clima por cidade da obra |
| `/obras` | `app/obras/page.tsx` | Sim | Sim | Integrado | Lista obras do Supabase |
| `/obras/nova` | `app/obras/nova/page.tsx` | Não | — | Integrado | Wizard 11 passos → insert `obras` |
| `/diario` | `app/diario/page.tsx` | Sim | Sim | Integrado | Timeline + criação via `createEntry` |
| `/materiais` | `app/materiais/page.tsx` | Sim | Sim | Integrado | Compras + formulário `createCompra` |
| `/mao-de-obra` | `app/mao-de-obra/page.tsx` | Sim | Sim | Integrado | Pagamentos + `createPagamento` |
| `/responsaveis` | `app/responsaveis/page.tsx` | Sim | Sim | Integrado | CRUD responsáveis |
| `/trocar-obra` | redirect | — | — | Redirect | 301 → `/responsaveis` |
| `/lembretes` | `app/lembretes/page.tsx` | Sim | Sim | Integrado | CRUD + `createReminder` |
| `/relatorios` | `app/relatorios/page.tsx` | Sim | **Não** | Integrado | KPIs reais da obra ativa; export `.txt` |
| `/assistente` | redirect | — | — | Redirect | → `/dashboard` |
| `/perfil` | `app/perfil/page.tsx` | Sim | Menu usuário | Integrado | Perfil + avatar Storage |
| `/assinatura` | `app/assinatura/page.tsx` | Sim | Menu usuário | Integrado | `useSubscription` read-only + link Hotmart |
| `/configuracoes` | `app/configuracoes/page.tsx` | Sim | Menu usuário | Stub | Toggles sem persistência |
| `/financeiro` | `app/financeiro/page.tsx` | Sim | **Não** | Integrado | Agrega compras + pagamentos |
| `/recibos` | redirect | — | — | Redirect | → `/dashboard` |
| `/clima` | redirect | — | — | Redirect | → `/dashboard` |
| `/equipe` | redirect | — | — | Redirect | → `/responsaveis` |

## Navegação (AppShell)

### Sidebar principal (`navItems`) — 7 itens

1. Início → `/dashboard`
2. Obras → `/obras`
3. Diário → `/diario`
4. Compras → `/materiais`
5. Pagamentos → `/mao-de-obra`
6. Pessoas → `/responsaveis`
7. Lembretes → `/lembretes`

### Menu usuário

- Perfil → `/perfil`
- Assinatura → `/assinatura`
- Configurações → `/configuracoes`
- Sair → modal → POST `/auth/signout` → redirect `/`

## Feature flags (client)

| Variável | Default | Efeito |
|----------|---------|--------|
| `NEXT_PUBLIC_AI_DOCK_ENABLED` | `false` | Dock IA no rodapé |
| `NEXT_PUBLIC_WHATSAPP_FAB_ENABLED` | `false` | FAB contato (requer `NEXT_PUBLIC_WHATSAPP_URL`) |

## Dock de IA (`showObrioInput`)

Somente quando `NEXT_PUBLIC_AI_DOCK_ENABLED=true`:

- `/dashboard`, `/diario`, `/materiais`, `/mao-de-obra`, `/lembretes`

Chama `POST /api/ai/chat`.

## APIs

| Rota | Função |
|------|--------|
| `POST /api/ai/chat` | Assistente (OpenAI se `OPENAI_API_KEY`, senão stub) |
| `POST /api/export/report` | Export textual da obra |
| `GET /api/weather` | Clima por cidade (Open-Meteo) |
| `POST /api/webhooks/hotmart` | Compra → invite → Resend |
| `POST /api/auth/signup` | Cadastro pós-compra |

## Rotas órfãs restantes

| Rota | Recomendação |
|------|--------------|
| `/financeiro` | Link no dashboard ou nav futuro |
| `/relatorios` | Acesso via dashboard (fora do nav principal) |
