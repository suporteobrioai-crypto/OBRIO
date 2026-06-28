# Testes — Obrio AI

Estratégia de testes: unit, E2E e CI.

## Estado atual

| Tipo | Status |
|------|--------|
| Unit tests | Vitest — `lib/__tests__/`, `lib/auth/signup-flow.test.ts` |
| E2E | Playwright — `e2e/auth-flow.spec.ts`, `e2e/auth-screen.spec.ts` |
| CI test gate | `.github/workflows/ci.yml` |
| Deploy gate | lint + test + build em `deploy.yml` |

Scripts:

```bash
npm test              # Vitest
npm run test:watch    # Vitest watch
npm run test:e2e      # Playwright
npm run lint          # ESLint
```

---

## Unit (Vitest)

Cobertura atual: mappers e utilitários em `lib/__tests__/`.

```bash
npm test
```

Adicionar testes co-localizados ou em `lib/__tests__/` para novos utils.

---

## E2E (Playwright)

### Configuração

- `playwright.config.ts` — baseURL de `PLAYWRIGHT_BASE_URL` (default `http://127.0.0.1:3001`)
- `webServer`: `npm run start -p 3001` (evita conflito com dev na 3000)

### Spec: auth screen

`e2e/auth-screen.spec.ts`:

1. Abas Entrar / Criar conta visíveis em `/`
2. `/?mode=cadastro` abre formulário de cadastro
3. `/cadastro` redireciona para auth unificado

### Spec: auth flow

`e2e/auth-flow.spec.ts`:

1. Visit `/` → formulário de login visível
2. Login com credenciais E2E → `/onboarding` (perfil incompleto) ou `/dashboard`
3. Logout via menu AppShell → volta ao login em `/`

### Credenciais E2E

Criar usuário dedicado no Supabase Auth (projeto `kvofxprsmzyxssjpyfmy`):

1. Dashboard → Authentication → Users → Add user
2. Email + senha forte (não usar conta pessoal)
3. Confirmar email se necessário

Variáveis:

| Variável | Onde |
|----------|------|
| `E2E_USER_EMAIL` | `.env.local` / GitHub secret |
| `E2E_USER_PASSWORD` | `.env.local` / GitHub secret |

Se ausentes, os testes E2E são **skipped** automaticamente.

### Rodar localmente

**Importante:** pare qualquer `npm run dev` antes de rodar E2E — o Playwright sobe `npm run start` na porta 3001 e compartilha `.next` com o dev; dois servidores ao mesmo tempo corrompem o cache (404 em `/_next/static`).

```bash
npm run build
E2E_USER_EMAIL=... E2E_USER_PASSWORD=... npm run test:e2e
```

Alternativa com dev já rodando (sem `webServer` duplicado): defina `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000` e rode os testes com o dev **único** ativo.

Instalar browsers (primeira vez):

```bash
npx playwright install chromium
```

---

## CI (GitHub Actions)

### Job `verify` (push + PR)

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Secrets: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `PUBLISHABLE_KEY`).

### Job `e2e` (push `main` only)

Após `verify`: build + `npm run test:e2e` com secrets E2E.

---

## Prioridades futuras

| Fluxo | Tipo | Prioridade |
|-------|------|------------|
| Criar obra via wizard | E2E | P1 |
| CRUD lembrete | E2E | P1 |
| RLS (2 usuários) | Manual | P0 |
| Redirects legados | E2E | P1 |
| Hotmart webhook (sync plano) | Integration | P4 — pós-sistema |
| API IA | Integration | P2 |

---

## Testes manuais (RLS)

Com usuário A e B:

- [ ] B não vê obras/registros de A
- [ ] Storage de A inacessível para B

Tabelas: `obras`, `lembretes`, `responsaveis`, `diario_entries`, `compras`, `materiais`, `prestadores`, `pagamentos`.

---

## Referências

- [ROADMAP.md](./ROADMAP.md)
- [DEVELOPMENT.md](./DEVELOPMENT.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [SECURITY.md](./SECURITY.md)
