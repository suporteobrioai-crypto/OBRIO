---
name: obrio-features
description: Domínio de negócio e módulos do Obrio AI — obras, reformas, materiais, mão de obra, lembretes, planos. Use ao implementar features, validar regras de negócio ou interpretar rotas do app.
---

# Obrio AI — Domínio e Features

## Produto

SaaS brasileiro de **gestão de obras e reformas** com assistente IA para captura rápida (texto, foto, áudio) e lembretes (app + WhatsApp planejado).

Personas: dono da obra, responsável técnico, colaborador convidado.

## Módulos e rotas

| Módulo | Rota | Persistência MVP |
|--------|------|------------------|
| Dashboard | `/dashboard` | Mock |
| Obras | `/obras`, `/obras/nova` | Mock |
| Diário | `/diario` | Mock |
| Materiais | `/materiais` | Mock |
| Mão de obra | `/mao-de-obra` | Mock |
| Responsáveis | `/trocar-obra` | CRUD local |
| Lembretes | `/lembretes` | CRUD local |
| Relatórios | `/relatorios` | Mock + export stub |
| Assistente | `/assistente` | Stub |
| Perfil / Assinatura / Config | `/perfil`, `/assinatura`, `/configuracoes` | Stub |
| Financeiro / Recibos / Clima / Equipe | rotas órfãs | Mock/stub |

Detalhe completo: `docs/ROUTES.md`

## Obra ativa (contexto global)

- Seletor no `AppShell` — não confundir com rota `/trocar-obra`
- Persistência: `localStorage` key `obrio-active-project`
- Evento: `CustomEvent("obrio:project-change")` para sync com dashboard
- Alvo: hook `useObraAtiva()` + Supabase

## Tipos de obra

- **Obra completa** vs **Reforma** (enum DB)
- Status: Ativa, Pausada, Concluída, Arquivada
- Campos: orçamento, gasto, progresso 0–100%, datas, endereço, responsável

## Planos e limites

Hardcoded em `AppShell` (`planRules`):

| Plano (demo) | Limite obras | Responsáveis/obra |
|--------------|--------------|-------------------|
| Premium | 10 | 1 |

UI de comparação em `/assinatura`. Pagamento ainda stub.

## Regras de negócio

### Materiais
- Compras com NF, categorias, garantias com alerta de vencimento
- Filtros por período (Hoje, 7d, 30d, Personalizado)
- Dock IA: consultas em linguagem natural sobre gastos

### Mão de obra
- Pagamentos a prestadores (pedreiro, eletricista, etc.)
- Status: pago, pendente, atrasado
- Alertas financeiros e próximos vencimentos

### Lembretes
- CRUD funcional in-memory: completar, adiar, editar título, excluir
- Canais planejados: app + WhatsApp
- Agrupados por data na agenda

### Responsáveis (`/trocar-obra`)
- Um responsável principal por obra (limite plano)
- Validação de formulário no modal
- **Não** é troca de obra — naming debt documentado

### Equipe (`/equipe`) — órfã
- Colaboradores com permissões
- Overlap com responsáveis — unificar na Fase 2

### Diário
- Entradas cronológicas com anexos (fotos)
- Filtros por período, autor, tag
- Dock IA registra entrada por texto (stub)

### Relatórios
- Gráficos de custo e progresso
- Análise IA (stub)
- Export PDF/Excel (stub)

## Assistente IA (dock global)

Rotas com dock: dashboard, diario, materiais, mao-de-obra, lembretes, relatorios, assistente.

Placeholders contextuais por módulo em `AppShell.tsx`. Envio ainda simulado.

## Integrações planejadas

| Integração | Módulo |
|------------|--------|
| Supabase | Todos |
| WhatsApp | Lembretes, clima, config |
| Clima API | Dashboard, `/clima` |
| Stripe | `/assinatura` |
| LLM | Assistente, SmartCapture, relatórios |

Ver `docs/INTEGRATIONS.md`

## Naming debts (não amplificar)

- `/trocar-obra` → renomear para `/responsaveis` (breaking change futuro)
- Consolidar `/equipe` com responsáveis/colaboradores
- Normalizar status mock ("Em andamento") → DB ("Ativa")

## Referências

- `docs/PRODUCT.md`
- `docs/ROUTES.md`
- `docs/DATA-MODEL.md`
- `docs/ROADMAP.md`
- `components/AppShell.tsx` — nav, planRules, projects mock
