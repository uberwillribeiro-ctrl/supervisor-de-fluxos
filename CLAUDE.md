# CLAUDE.md — Supervisor de Fluxos

## Stack

- **React 19** + **TypeScript 5 strict** + **Vite 6**
- **Tailwind CSS 4** (via `@tailwindcss/vite`, sem `tailwind.config.ts`)
- **Motion** (Framer Motion v12) para animações
- **Lucide React** para ícones
- **Supabase** para backend/auth (milestones M8+)
- **jsPDF + jspdf-autotable** para geração de PDF (milestone M6+)

## Alias de Imports

O alias `@/` aponta para `src/`. Sempre prefira:

```ts
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
```

## Nomenclatura

| Contexto | Padrão | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `CaseCard.tsx`, `ProcedureForm.tsx` |
| Tipos e Interfaces | PascalCase | `CaseRecord`, `ProcedureType` |
| Funções e variáveis | camelCase | `formatDate`, `caseList` |
| Variáveis de ambiente | SCREAMING_SNAKE | `VITE_SUPABASE_URL` |
| Hooks customizados | camelCase com prefixo `use` | `useAuth`, `useCases` |

## Regras de Código

- **Proibido `any`** — use `unknown` com type guard
- **Somente classes Tailwind** — proibido `style={{}}` inline, CSS Modules, CSS-in-JS
- **Variantes de estado** via helper `cn()` de `@/utils/cn`
- **Um componente por arquivo** — nome do arquivo = nome do componente
- **`.tsx`** para componentes React; **`.ts`** para hooks, tipos, utils
- Sem imports circulares

## Estilo de Formatação

- 2 espaços de indentação
- Aspas simples
- Semicolons obrigatórios
- Trailing comma em multi-line

## Estrutura de Pastas

```
src/
  assets/           # imagens e ícones locais
  components/
    ui/             # Button, Badge, Input, Modal, Toast, Spinner…
    layout/         # Sidebar, Header, PageWrapper, AppShell
    features/       # CaseCard, ProcedureForm, RMATable…
  hooks/            # useAuth, useCases, useProcedures…
  lib/              # supabase.ts, pdf.ts
  pages/            # Dashboard, Cases, Reports, Login…
  types/            # case.ts, procedure.ts, user.ts
  utils/            # cn.ts, formatDate.ts, normalizeSearch.ts, ageRange.ts
supabase/
  migrations/       # SQL versionado (001_*.sql, 002_*.sql…)
```

## Cores Semânticas

| Uso | Classe Tailwind |
|---|---|
| Ação primária / nav ativo | `indigo-600` / `indigo-700` |
| Badge Ativo / sucesso | `emerald-500` |
| Badge Novo / edição | `amber-500` |
| Exclusão / Arquivado | `red-500` |
| Background de página | `slate-50` |
| Surface (cards, modais) | `white` |
| Bordas e divisores | `slate-200` |

## Milestones

Ver `Docs/PLAN.md` para a lista completa de milestones e entregáveis por branch.

O fluxo de merge é sempre: `branch` → PR → `main`.
