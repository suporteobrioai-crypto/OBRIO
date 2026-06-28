# Design System — Obrio AI

Guia visual e de componentes.

## Princípios

- **Mobile-first** — nav pills, grids responsivos, touch targets ≥ 44px
- **Construção + confiança** — verdes profundos + laranja energético
- **Clareza operacional** — métricas em destaque, labels uppercase pequenas
- **Consistência** — `rounded-[8px]` em cards, inputs e botões

## Tokens de cor

Definidos em `tailwind.config.ts`:

| Token | Hex | Uso |
|-------|-----|-----|
| `foundation` | `#0E332A` | Primary, sidebar ativo, headings, botões primários |
| `moss` | `#1E5C4C` | Hover, estados de sucesso |
| `build` | `#F17B22` | Accent, CTAs, títulos de página, focus rings |
| `concrete` | `#EEF1EF` | Superfícies secundárias, pills inativas |
| `graphite` | `#1E2523` | Texto corpo |

## Tipografia

- **Família:** Arial, Helvetica, sans-serif (`app/globals.css`)
- **Headings:** `font-black`
- **Labels de seção:** `text-xs font-black uppercase tracking-normal text-graphite/50`

## Espaçamento e forma

| Padrão | Valor |
|--------|-------|
| Border radius | `rounded-[8px]` |
| Input height | `h-12` / `h-14` (login) |
| Container max | `max-w-[1440px]` |
| Shadow cards | `shadow-soft` |

## Componentes (`components/Ui.tsx`)

- `Card`, `Metric`, `Field`, `SelectField`, `PrimaryButton`, `SmartCaptureBox`

## Componentes de marca

| Componente | Arquivo | Uso |
|------------|---------|-----|
| `Brand` | `components/Brand.tsx` | Logo + link na auth |
| `ObrioMark` | `components/ObrioMark.tsx` | Marca "OB" inline (fallback; PNG opcional em `public/obrio-logo.png`) |
| `WhatsAppIcon` | `components/WhatsAppIcon.tsx` | SVG inline verde |

## Favicon

- `public/favicon.svg` — referenciado em `app/layout.tsx` metadata

## CSS global (`app/globals.css`)

| Classe | Função |
|--------|--------|
| `.report-chart-bar` | Animação nos gráficos de relatórios |
| `.obrio-materials-dock` | Posicionamento fixo do dock IA |

> `.hero-bg` removido — a raiz é login, não landing.

## Ícones

**lucide-react** em todo o app. Nav icons em `AppShell.tsx`.

## Acessibilidade (checklist)

- [x] Labels em inputs (`Field`, login form)
- [x] Focus visível: `focus:border-build`
- [x] Botões min ~44px
- [x] ObrioMark com fallback acessível (iniciais "OB")
- [ ] Modais: trap focus e ESC

## Referências

- `tailwind.config.ts`
- `app/globals.css`
- `components/Ui.tsx`
- Skill: `.cursor/skills/obrio-ui/SKILL.md`
