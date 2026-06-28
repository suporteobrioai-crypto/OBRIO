---
name: obrio-ui
description: Design system e padrões visuais do Obrio AI. Use ao criar ou estilizar páginas, componentes, modais e layouts — Tailwind tokens, Ui.tsx, AppShell, mobile-first.
---

# Obrio AI — UI e Design System

## Tokens de cor (tailwind.config.ts)

| Token | Uso |
|-------|-----|
| `foundation` | Primary, headings, botões, sidebar ativo |
| `moss` | Hover, success |
| `build` | Accent laranja, títulos AppShell, focus |
| `concrete` | Superfícies secundárias, pills inativas |
| `graphite` | Texto corpo |

**Nunca** usar cores ad hoc (`#3b82f6`, `blue-500`) em código novo.

Background de página: `#f7f8f6` (via `--background` em globals.css).

## Componentes reutilizáveis

Importar de `@/components/Ui.tsx`:

| Componente | Quando usar |
|------------|-------------|
| `Card` | Seções, containers |
| `Metric` | KPIs (label + valor + helper) |
| `Field` | Input texto (uncontrolled) |
| `SelectField` | Select controlado |
| `PrimaryButton` | CTA primário |
| `SmartCaptureBox` | Captura IA (texto + câmera + upload + áudio) |

Marca: `Brand`, `ObrioMark`, `WhatsAppIcon`.

## Layout autenticado

Usar `AppShell` com `title`, `subtitle`, `action?`:

```tsx
<AppShell title="Materiais" subtitle="Compras e garantias da obra.">
```

AppShell fornece sidebar, nav mobile, seletor de obra, dock IA e FAB WhatsApp — **não duplicar** esses elementos na page.

## Padrão de página

```
1. Row de Metric (grid 2–4 cols, gap-4)
2. Card de filtros (pills: Hoje | 7 dias | 30 dias | Personalizado)
3. Seções de conteúdo (Cards, listas, gráficos)
```

## Tipografia

- Headings: `font-black`
- Labels de seção: `text-xs font-black uppercase text-graphite/50`
- Inputs: `h-12 rounded-[8px] border border-black/10 focus:border-build`

## Forma e espaçamento

- Border radius padrão: `rounded-[8px]`
- Cards: `shadow-soft border border-black/5`
- Container: `max-w-[1440px]`
- Mobile-first: `sm:`, `md:`, `xl:` breakpoints

## Alertas por tom

| Tom | Uso |
|-----|-----|
| verde / `#EAF4EF` | OK |
| laranja / `#FFF4EA` | Atenção |
| vermelho | Urgente / vencido |

## Ícones

`lucide-react`, tamanho 18–24px. Nav icons definidos em `AppShell.tsx`.

## Páginas standalone (sem AppShell)

`/`, `/login`, `/cadastro`, `/obras/nova` — layout próprio.

## Acessibilidade

- `Field` já inclui `<label>` — manter em inputs novos
- Botões interativos: `min-h-12` (~44px touch)
- Focus visível nos inputs

## Referências

- `docs/DESIGN-SYSTEM.md`
- `tailwind.config.ts`
- `app/globals.css`
- `components/Ui.tsx`

## Evitar

- Introduzir shadcn/ui ou Radix sem aprovação
- Fontes externas sem decisão
- Duplicar nav/sidebar fora do AppShell
