---
name: obrio-conventions
description: Convenções TypeScript e React do projeto Obrio AI. Use ao criar ou editar código no repositório obrio-ai — páginas, componentes, hooks, types e migrations.
---

# Obrio AI — Convenções de Código

## Stack

Next.js 14 App Router · React 18 · TypeScript strict · Tailwind 3 · alias `@/*`

## Regras obrigatórias

### Imports

- Sempre no **topo do arquivo** — nunca inline em corpos de função ou campos de tipo
- Usar alias: `@/components/...`, `@/lib/...`, `@/types/...`

### TypeScript

- `strict: true` — evitar `any`
- Identificadores em **inglês** (variáveis, funções, tipos, arquivos)
- Copy de UI em **português** (labels, placeholders, mensagens)
- Switch em unions/enums: `default` com `const _exhaustive: never = value`

### React / Next.js

- Uma `page.tsx` por rota em `app/`
- `"use client"` apenas quando necessário (hooks, eventos, browser APIs)
- Exports nomeados para componentes: `export function Card()`
- Um componente principal por arquivo

### Escopo de mudanças

- Diff mínimo — não refatorar código não relacionado à tarefa
- Reutilizar componentes existentes antes de criar novos
- Seguir padrões do arquivo que está editando

## Padrão de página autenticada

```tsx
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";

export default function MinhaPage() {
  return (
    <AppShell title="Título" subtitle="Subtítulo">
      {/* metrics → filters → content */}
    </AppShell>
  );
}
```

Após criar rota autenticada: adicionar em `navItems` em `components/AppShell.tsx` se deve aparecer no menu; documentar em `docs/ROUTES.md`.

## Evolução mock → Supabase

1. Types em `types/`
2. Hook com interface estável (`useLembretes()`)
3. Mock primeiro, depois query Supabase no hook
4. UI consome hook — não fetch direto na page

## Estrutura de pastas alvo

```
app/           # rotas
components/    # UI compartilhada
lib/           # supabase, utils
types/         # tipos de domínio
hooks/         # data hooks
supabase/migrations/
```

## Documentação

Consultar antes de implementar features novas:

- `docs/ARCHITECTURE.md`
- `docs/ROUTES.md`
- `docs/DATA-MODEL.md`
- `docs/ROADMAP.md`

## O que evitar

- shadcn/Radix sem decisão explícita
- Context/Zustand sem necessidade — preferir hooks
- Commits de `.env.local` ou secrets
- Cores Tailwind genéricas (`blue-500`) — usar tokens Obrio (skill `obrio-ui`)
