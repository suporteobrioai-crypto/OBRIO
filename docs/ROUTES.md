# Mapa de Rotas — Obrio AI

Referência completa das rotas do App Router (`app/`).

## Legenda de status

| Status | Significado |
|--------|-------------|
| **Integrado** | Conectado a Supabase via hooks ou client |
| **Stub** | Botão/ação visual sem backend real |
| **Mock** | Dados estáticos ou simulados |

## Tabela de rotas

| Rota | Arquivo | AppShell | Nav | Status | Descrição |
|------|---------|----------|-----|--------|-----------|
| `/` | `app/page.tsx` | Não | — | Integrado | Login; autenticado → `/obras/nova` (sem obras) ou `/dashboard` |
| `/login` | `app/login/page.tsx` | Não | — | Integrado | Alias do login; mesmo redirect pós-auth |
| `/cadastro` | `app/cadastro/page.tsx` | Não | — | Integrado | Wizard OTP + senha + perfil (Supabase) |
| `/dashboard` | `app/dashboard/page.tsx` | Sim | Sim | Integrado | Hub: métricas, lembretes, diário, financeiro |
| `/obras` | `app/obras/page.tsx` | Sim | Sim | Integrado | Lista obras do Supabase |
| `/obras/nova` | `app/obras/nova/page.tsx` | Não | — | Integrado | Wizard 11 passos → insert `obras` |
| `/diario` | `app/diario/page.tsx` | Sim | Sim | Integrado | Timeline diário (hook `useDiario`) |
| `/materiais` | `app/materiais/page.tsx` | Sim | Sim | Integrado | Compras, NF, garantias |
| `/mao-de-obra` | `app/mao-de-obra/page.tsx` | Sim | Sim | Integrado | Pagamentos (`usePagamentos`) |
| `/trocar-obra` | `app/trocar-obra/page.tsx` | Sim | Sim | Integrado | Responsáveis (`useResponsaveis`) |
| `/lembretes` | `app/lembretes/page.tsx` | Sim | Sim | Integrado | CRUD lembretes |
| `/relatorios` | `app/relatorios/page.tsx` | Sim | Sim | Stub | Gráficos; export PDF/Excel stub |
| `/assistente` | `app/assistente/page.tsx` | Sim | Sim | Stub | Chat simulado no dock |
| `/perfil` | `app/perfil/page.tsx` | Sim | Menu usuário | Integrado | Perfil + avatar Storage |
| `/assinatura` | `app/assinatura/page.tsx` | Sim | Menu usuário | Stub | Planos UI; Stripe pendente |
| `/configuracoes` | `app/configuracoes/page.tsx` | Sim | Menu usuário | Stub | Toggles, WhatsApp (sem API) |
| `/financeiro` | `app/financeiro/page.tsx` | Sim | **Não** | Integrado | Despesas via `useMateriais` + `usePagamentos` |
| `/recibos` | `app/recibos/page.tsx` | Sim | **Não** | Stub | Form + preview; PDF/print stub |
| `/clima` | `app/clima/page.tsx` | Sim | **Não** | Mock | Previsão estática |
| `/equipe` | `app/equipe/page.tsx` | Sim | **Não** | Mock | Colaboradores; overlap `/trocar-obra` |

## Navegação (AppShell)

### Sidebar principal (`navItems`)

1. Dashboard → `/dashboard`
2. Obras → `/obras`
3. Diário da Obra → `/diario`
4. Compras, Notas Fiscais e Garantias → `/materiais`
5. Pagamentos da Equipe → `/mao-de-obra`
6. Responsáveis pelas Obras → `/trocar-obra`
7. Lembretes → `/lembretes`
8. Relatórios → `/relatorios`

### Assistente (item separado)

- Assistente Obrio AI → `/assistente`

### Menu usuário

- Perfil → `/perfil`
- Assinatura → `/assinatura`
- Responsáveis pelas Obras → `/trocar-obra`
- Configurações → `/configuracoes`
- Sair → modal → POST `/auth/signout` → redirect `/`

## Dock de IA (`showObrioInput`)

- `/dashboard`, `/diario`, `/materiais`, `/mao-de-obra`, `/lembretes`, `/relatorios`, `/assistente`

## FAB WhatsApp (`showWhatsAppButton`)

- `/dashboard`, `/obras`, `/diario`, `/materiais`, `/mao-de-obra`, `/lembretes`, `/relatorios`, `/assistente`

Link destino: `/configuracoes`

## Rotas órfãs

| Rota | Recomendação |
|------|--------------|
| `/financeiro` | Integrar ao nav ou fundir com dashboard |
| `/recibos` | Submenu financeiro |
| `/clima` | Embed no dashboard; API real F3 |
| `/equipe` | Unificar com `/trocar-obra` |

## Inconsistências de naming

| Problema | Detalhe |
|----------|---------|
| `/trocar-obra` | Label: "Responsáveis pelas Obras" |
| Troca de obra | Seletor no AppShell, não esta rota |

**Sugestão futura:** `/trocar-obra` → `/responsaveis`

## Páginas standalone

- `/`, `/login`, `/cadastro`, `/obras/nova`

## Redirect pós-login

Após login, callback OAuth ou visita autenticada a rotas de auth:

| Condição | Destino |
|----------|---------|
| Usuário sem obras | `/obras/nova` (onboarding) |
| Usuário com obras | `/dashboard` |
| `?redirect=` para rota protegida | Destino solicitado |

Implementado em [`lib/auth/post-login-path.ts`](../lib/auth/post-login-path.ts).

## Referências

- [PRODUCT.md](./PRODUCT.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- `components/AppShell.tsx`
