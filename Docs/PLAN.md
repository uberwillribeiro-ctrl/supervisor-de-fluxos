# PLAN — Supervisor de Fluxos

**Versão:** 1.0  
**Data:** 2026-04-15  
**Estratégia:** Interface primeiro → Backend depois → Deploy

> Cada milestone é uma branch isolada, entregável e testável antes de avançar.  
> O fluxo de merge é sempre: `branch` → PR → `main`.

---

## Visão Geral dos Milestones

| # | Milestone | Branch | Camada |
|---|---|---|---|
| M0 | Project Setup & Scaffold | `setup/init` | Infra |
| M1 | Design System & Primitivos UI | `feat/design-system` | UI |
| M2 | Landing Page & Onboarding | `feat/landing-page` | UI |
| M3 | Auth UI (mock) | `feat/auth-ui` | UI |
| M4 | Gestão de Casos UI (mock) | `feat/cases-ui` | UI |
| M5 | Registro de Procedimentos UI (mock) | `feat/procedures-ui` | UI |
| M6 | Relatórios, RMA & Observatório UI | `feat/reports-ui` | UI |
| M7 | Dashboard & Busca/Filtros UI | `feat/dashboard-ui` | UI |
| M8 | Backend: Schema Supabase & Auth Real | `feat/supabase-auth` | Backend |
| M9 | Backend: Integração Casos & Procedimentos | `feat/supabase-cases` | Backend |
| M10 | Backend: Integração Relatórios & RMA | `feat/supabase-reports` | Backend |
| M11 | Notificações & Realtime | `feat/notifications` | Backend |
| M12 | Painel Admin & Gestão de Usuários | `feat/admin` | Backend |
| M13 | Polish, Acessibilidade & Responsividade | `feat/polish` | UI/QA |
| M14 | Deploy & CI/CD | `feat/deploy` | Infra |

---

## M0 — Project Setup & Scaffold

**Branch:** `setup/init`  
**Objetivo:** Criar a fundação técnica do projeto com todas as ferramentas configuradas.

### Entregáveis

- [x] `npm create vite@latest` com template `react-ts`
- [x] Instalar dependências: `tailwindcss@4`, `motion`, `lucide-react`, `clsx`
- [x] Instalar dev deps: `eslint`, `prettier`, `husky`, `lint-staged`
- [x] Configurar `tsconfig.json` com `"strict": true` e path alias `@/`
- [x] Configurar `vite.config.ts` com `resolve.alias: { '@': '/src' }`
- [x] Configurar Tailwind 4 com tokens de cor do design system (indigo, emerald, amber, slate)
- [x] Configurar `.eslintrc` + `.prettierrc` (2 espaços, aspas simples, semicolons)
- [x] Configurar Husky + lint-staged no pre-commit
- [x] Criar estrutura de pastas completa conforme PRD §8
- [x] Criar `src/utils/cn.ts` (helper `clsx` + `tailwind-merge`)
- [x] Criar `CLAUDE.md` na raiz com convenções do projeto
- [x] Verificar `npm run dev` sem erros

### Commit Final

```
chore: initialize project scaffold with Vite, React 19, TypeScript strict, Tailwind 4 and tooling
```

---

## M1 — Design System & Primitivos UI

**Branch:** `feat/design-system`  
**Objetivo:** Construir a biblioteca de componentes reutilizáveis que sustentará todas as telas.

### Entregáveis

**Primitivos (`src/components/ui/`)**
- [ ] `Button.tsx` — variantes: primary, secondary, ghost, danger; tamanhos: sm, md, lg
- [ ] `Badge.tsx` — variantes semânticas: novo (amber), ativo (emerald), arquivado (red), neutro (slate)
- [ ] `Input.tsx` — com label, placeholder, mensagem de erro e estado disabled
- [ ] `Select.tsx` — dropdown controlado com label e erro
- [ ] `Modal.tsx` — overlay com slide-up 200ms, trap de foco, fechar com Escape
- [ ] `Toast.tsx` — notificação temporária (success, error, info) com slide-in 300ms
- [ ] `Spinner.tsx` — loading indicator
- [ ] `EmptyState.tsx` — ilustração + texto para listas vazias
- [ ] `Divider.tsx` — separador visual horizontal

**Layout (`src/components/layout/`)**
- [ ] `Sidebar.tsx` — navegação lateral com itens ativos destacados em indigo-600
- [ ] `Header.tsx` — barra superior com título da página e avatar do usuário
- [ ] `PageWrapper.tsx` — container com padding padrão e max-width
- [ ] `AppShell.tsx` — composição de Sidebar + Header + PageWrapper

**Tipos base (`src/types/`)**
- [ ] `case.ts` — interface `CaseRecord`, enum `CaseStatus` (NEW, ACTIVE, ARCHIVED)
- [ ] `procedure.ts` — interface `ProcedureRecord`, enum `ProcedureType`
- [ ] `user.ts` — interface `UserProfile`, enum `UserRole` (ADMIN, COORDINATOR, TECHNICIAN)

**Utilitários (`src/utils/`)**
- [ ] `formatDate.ts` — formatar datas em pt-BR com `Intl.DateTimeFormat`
- [ ] `normalizeSearch.ts` — remover acentos e normalizar para busca
- [ ] `ageRange.ts` — calcular faixa etária (0-10, 11-17, 18+) a partir da data de nascimento

### Commit Final

```
feat: add design system primitives, layout shell and base types
```

---

## M2 — Landing Page & Onboarding

**Branch:** `feat/landing-page`  
**Objetivo:** Criar a página pública de apresentação do produto e o fluxo de onboarding.

### Entregáveis

**Landing Page (`src/pages/Landing.tsx`)**
- [ ] Hero section — headline, subtítulo, CTA "Acessar sistema" e "Solicitar demonstração"
- [ ] Seção de problemas — 3 cards ilustrando "Caos do Papel", "Pesadelo do RMA", "Perda de Histórico"
- [ ] Seção de solução — 3 pilares com ícones Lucide
- [ ] Seção de personas — cards para Técnico, Coordenador e Administrador
- [ ] Seção de features — grade com as 5 funcionalidades principais
- [ ] Footer institucional com logo e links

**Onboarding (`src/pages/Onboarding.tsx`)**
- [ ] Passo 1: Boas-vindas e apresentação do fluxo
- [ ] Passo 2: Configuração do perfil (nome, cargo, unidade)
- [ ] Passo 3: Tour guiado das funcionalidades principais
- [ ] Indicador de progresso (steps 1/3, 2/3, 3/3)
- [ ] Navegação Anterior / Próximo / Concluir

**Roteamento (`src/main.tsx`)**
- [ ] Configurar `react-router-dom` com rotas: `/`, `/onboarding`, `/login`, `/app/*`
- [ ] Rota `/app/*` protegida (redireciona para `/login` se não autenticado)

### Commit Final

```
feat: add landing page, onboarding flow and base routing
```

---

## M3 — Auth UI (Mock)

**Branch:** `feat/auth-ui`  
**Objetivo:** Construir todas as telas de autenticação com contexto mock — sem Supabase ainda.

### Entregáveis

**Telas (`src/pages/`)**
- [ ] `Login.tsx` — e-mail + senha, link "Esqueci minha senha", logo da aplicação
- [ ] `ForgotPassword.tsx` — campo de e-mail + instrução de recuperação
- [ ] `Profile.tsx` — visualização e edição de nome, cargo, unidade e avatar

**Contexto Mock (`src/hooks/useAuth.ts`)**
- [ ] Interface `AuthContext` com `user`, `login()`, `logout()`, `isLoading`
- [ ] `AuthProvider` com estado local (sem chamada real)
- [ ] Hook `useAuth()` para consumo nos componentes
- [ ] Usuários mock hardcoded: admin@creas.gov, tecnico@creas.gov, coord@creas.gov

**Guards de Rota (`src/components/layout/`)**
- [ ] `ProtectedRoute.tsx` — redireciona para `/login` se `user` for null
- [ ] `RoleGuard.tsx` — renderiza `null` se o perfil não tiver permissão

**UX**
- [ ] Estado de loading no botão de login (Spinner)
- [ ] Mensagem de erro em credenciais inválidas (Toast danger)
- [ ] Persistência de sessão em `localStorage` (mock)

### Commit Final

```
feat: add auth screens, mock auth context and route guards
```

---

## M4 — Gestão de Casos UI (Mock)

**Branch:** `feat/cases-ui`  
**Objetivo:** Construir o módulo central de gestão de casos com dados estáticos.

### Entregáveis

**Página de Casos (`src/pages/Cases.tsx`)**
- [ ] Abas animadas: Novos / Ativos / Arquivados (transição 200ms)
- [ ] Contador de casos por aba no badge
- [ ] Botão "Novo Caso" no header da página

**Componentes de Caso (`src/components/features/`)**
- [ ] `CaseList.tsx` — lista com paginação (10 itens/página)
- [ ] `CaseCard.tsx` — exibe: código, nome, bairro, responsável, data do último relatório, badge de status
- [ ] `CaseDetail.tsx` — painel lateral ou modal com histórico completo do caso
- [ ] `CaseForm.tsx` — formulário de novo caso: nome, CPF, código, data nascimento, endereço, bairro, responsável, serviço (PAEFI/SEV), motivo da entrada
- [ ] `ArchiveModal.tsx` — modal de arquivamento: motivo de desligamento (dropdown), data, observações
- [ ] `InactivityAlert.tsx` — destaque visual (borda âmbar) para casos sem relatório há mais de 30 dias

**Dados Mock (`src/lib/mockData.ts`)**
- [ ] Array de 20 casos fictícios cobrindo os 3 status
- [ ] Distribuição de bairros e responsáveis variados

**Busca Local**
- [ ] Input de busca filtrado por nome, CPF ou código (usando `normalizeSearch`)
- [ ] Filtro por responsável (select)

### Commit Final

```
feat: add case management UI with tabs, forms, archive modal and mock data
```

---

## M5 — Registro de Procedimentos UI (Mock)

**Branch:** `feat/procedures-ui`  
**Objetivo:** Construir o módulo de lançamento diário de procedimentos com mapeamento RMA.

### Entregáveis

**Componentes (`src/components/features/`)**
- [ ] `ProcedureForm.tsx` — campos: tipo de procedimento (dropdown), data, profissional responsável, quantidade de participantes, faixa etária (auto-calculada), observações
- [ ] `ProcedureList.tsx` — lista dos procedimentos do caso selecionado, ordenados por data
- [ ] `ProcedureCard.tsx` — exibe: tipo, data, responsável, participantes, faixa etária, badge de mapeamento RMA
- [ ] `AgeRangeDisplay.tsx` — visualização dos participantes distribuídos por faixa (0-10 / 11-17 / 18+)

**Lógica de Mapeamento RMA (`src/utils/rmaMapping.ts`)**
- [ ] Enum `RMAColumn` com todas as células do relatório oficial do Ministério
- [ ] Função `mapProcedureToRMA(procedure)` → retorna coluna(s) do RMA afetadas
- [ ] Função `calculateAgeRange(birthDate, referenceDate)` → retorna faixa etária

**Integração na CaseDetail**
- [ ] Aba "Procedimentos" dentro de `CaseDetail.tsx`
- [ ] Botão "Registrar Procedimento" abre `ProcedureForm` em modal
- [ ] Lista de procedimentos do caso abaixo do formulário

### Commit Final

```
feat: add procedure registration UI with RMA mapping and age range logic
```

---

## M6 — Relatórios, RMA & Observatório UI

**Branch:** `feat/reports-ui`  
**Objetivo:** Construir o motor de saída de dados — visualizações e geração de PDF.

### Entregáveis

**Página de Relatórios (`src/pages/Reports.tsx`)**
- [ ] Filtros de cabeçalho: Mês de Referência + Ano + Serviço (PAEFI/SEV)
- [ ] Abas: RMA | Máscara | Observatório

**RMA Table (`src/components/features/RMATable.tsx`)**
- [ ] Tabela formatada com todas as colunas do RMA oficial
- [ ] Totalizadores automáticos por linha e coluna
- [ ] Destaque visual para células com valores zerados (potencial subnotificação)
- [ ] Botão "Exportar PDF" — gera PDF formatado via jsPDF (com mock data)

**Máscara (`src/components/features/MascaraView.tsx`)**
- [ ] Layout formatado para impressão conforme padrão SUAS
- [ ] Botão "Imprimir" com `window.print()` e CSS `@media print`

**Observatório Quantitativo (`src/components/features/Observatory.tsx`)**
- [ ] Cards de saldo: Total Casos / Entradas no Mês / Saídas no Mês / Resolutividade (%)
- [ ] Breakdown por bairro (tabela)
- [ ] Breakdown por faixa de vulnerabilidade (gráfico de barras simples com divs)

**lib/pdf.ts**
- [ ] Função `generateRMAPDF(data, month, year)` → Blob do PDF
- [ ] Cabeçalho com nome do serviço, mês/ano e assinatura do coordenador
- [ ] Rodapé com data de geração e numeração de página

### Commit Final

```
feat: add reports page, RMA table, Mascara view, Observatory and PDF generation
```

---

## M7 — Dashboard & Busca/Filtros UI

**Branch:** `feat/dashboard-ui`  
**Objetivo:** Criar a tela inicial de visão geral e o sistema de busca global.

### Entregáveis

**Dashboard (`src/pages/Dashboard.tsx`)**
- [ ] Cards de métricas: Total Ativos, Novos este mês, Arquivados este mês, Procedimentos este mês
- [ ] Lista "Casos em Alerta" — casos sem atualização há mais de 30 dias
- [ ] Lista "Últimos Procedimentos" — feed dos 5 últimos registros
- [ ] Gráfico de barras simples: Casos por mês (últimos 6 meses, com divs)
- [ ] Boas-vindas personalizadas: "Olá, [Nome]" com data atual

**Busca Global (`src/components/features/GlobalSearch.tsx`)**
- [ ] Input na Header com atalho `Ctrl+K`
- [ ] Modal de resultados com busca por: nome, CPF, código do caso
- [ ] Normalização sem acento, case-insensitive
- [ ] Resultado redireciona para `CaseDetail`

**Filtros Avançados (`src/components/features/FilterBar.tsx`)**
- [ ] Filtro por Mês de Referência
- [ ] Filtro por Ano
- [ ] Filtro por Bairro
- [ ] Filtro por Profissional Responsável
- [ ] Filtro por Serviço (PAEFI / SEV)
- [ ] Botão "Limpar filtros"
- [ ] Estado dos filtros propagado via URL search params

### Commit Final

```
feat: add dashboard overview, global search with Ctrl+K and advanced filters
```

---

## M8 — Backend: Schema Supabase & Auth Real

**Branch:** `feat/supabase-auth`  
**Objetivo:** Criar o banco de dados real no Supabase e substituir o auth mock.

### Entregáveis

**Supabase Setup**
- [ ] Criar projeto no Supabase (produção)
- [ ] Configurar variáveis de ambiente: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] Instalar `@supabase/supabase-js`
- [ ] Criar `src/lib/supabase.ts` — client tipado com `Database` type gerado

**Migrations SQL (`supabase/migrations/`)**
- [ ] `001_create_users_profiles.sql` — tabela `profiles` (id, name, role, unit, created_at)
- [ ] `002_create_cases.sql` — tabela `cases` (id, code, name, cpf, birth_date, address, neighborhood, service, status, entry_date, archive_date, archive_reason, responsible_id, created_by, created_at)
- [ ] `003_create_procedures.sql` — tabela `procedures` (id, case_id, type, date, responsible_id, participants_0_10, participants_11_17, participants_18plus, rma_column, notes, created_by, created_at)
- [ ] `004_rls_policies.sql` — políticas RLS: técnico vê apenas seus casos; coordenador vê todos; admin sem restrição

**Auth Real (`src/hooks/useAuth.ts`)**
- [ ] Substituir mock por `supabase.auth.signInWithPassword()`
- [ ] `supabase.auth.signOut()` no logout
- [ ] `supabase.auth.onAuthStateChange()` para persistência de sessão
- [ ] Buscar `profile` do usuário após login e injetar no contexto
- [ ] Redirecionar para `/onboarding` em primeiro acesso (sem profile)

### Commit Final

```
feat: wire Supabase auth, database schema migrations and RLS policies
```

---

## M9 — Backend: Integração Casos & Procedimentos

**Branch:** `feat/supabase-cases`  
**Objetivo:** Conectar os módulos de Casos e Procedimentos ao banco real.

### Entregáveis

**Hooks de Dados (`src/hooks/`)**
- [ ] `useCases.ts` — `fetchCases(filters)`, `createCase(data)`, `updateCase(id, data)`, `archiveCase(id, reason)`
- [ ] `useProcedures.ts` — `fetchProcedures(caseId)`, `createProcedure(data)`, `deleteProcedure(id)`
- [ ] `useCase.ts` — busca um caso por id ou código (para autopreenchimento)

**Integrações**
- [ ] Remover todos os `mockData` de `Cases.tsx` e `CaseDetail.tsx`
- [ ] Autopreenchimento em `ProcedureForm` ao digitar código do caso (query ao Supabase)
- [ ] Loading states com `Spinner` em todas as operações assíncronas
- [ ] Error handling com `Toast` danger para falhas de rede
- [ ] Otimistic UI: adicionar item à lista antes da confirmação do servidor

**Tipagem (`src/lib/supabase.ts`)**
- [ ] Gerar types com `supabase gen types typescript` e importar no projeto
- [ ] Garantir que todos os hooks usem tipos derivados do schema real

### Commit Final

```
feat: integrate cases and procedures CRUD with Supabase, remove mock data
```

---

## M10 — Backend: Integração Relatórios & RMA

**Branch:** `feat/supabase-reports`  
**Objetivo:** Conectar o motor de relatórios a dados reais do banco.

### Entregáveis

**Hook de Relatórios (`src/hooks/useReports.ts`)**
- [ ] `fetchRMAData(month, year, service)` — agrupa procedimentos por coluna RMA
- [ ] `fetchObservatoryData(month, year)` — saldo de casos (entradas/saídas/resolutividade)
- [ ] `fetchCasesByNeighborhood(month, year)` — breakdown por bairro

**Queries Supabase**
- [ ] Consulta agregada de procedimentos por `rma_column` + faixa etária
- [ ] Consulta de casos com `entry_date` e `archive_date` no mês filtrado
- [ ] Consulta de casos sem procedimento nos últimos 30 dias (alerta de inatividade)

**PDF com Dados Reais**
- [ ] `generateRMAPDF(data, month, year)` consumindo resultado real de `fetchRMAData`
- [ ] Cabeçalho com nome da unidade vindo do perfil do coordenador

**Observatório**
- [ ] Cards e gráficos do `Observatory.tsx` conectados a dados reais
- [ ] Atualização automática ao trocar filtros

### Commit Final

```
feat: wire reports, RMA aggregation and Observatory to live Supabase data
```

---

## M11 — Notificações & Realtime

**Branch:** `feat/notifications`  
**Objetivo:** Adicionar feedback em tempo real e alertas proativos.

### Entregáveis

**Realtime Supabase**
- [ ] Subscription em `cases` — atualiza lista ao inserir/alterar qualquer caso
- [ ] Subscription em `procedures` — atualiza contadores do Dashboard
- [ ] Indicador visual "ao vivo" no Dashboard quando conectado ao canal

**Sistema de Notificações**
- [ ] `Toast.tsx` já criado — conectar a todas as operações CRUD
- [ ] `NotificationBell.tsx` na Header — lista das últimas 5 ações do dia
- [ ] Alerta de casos inativos: badge "!" em `Sidebar` no item Casos quando há inativos

**Alertas de Inatividade**
- [ ] Hook `useInactivityAlerts()` — busca casos sem procedimento há mais de 30 dias
- [ ] `InactivityAlert.tsx` já criado — exibir na aba Ativos e no Dashboard
- [ ] E-mail de alerta via Supabase Edge Function (opcional / documentar como extensão futura)

### Commit Final

```
feat: add Supabase Realtime subscriptions, toast notifications and inactivity alerts
```

---

## M12 — Painel Admin & Gestão de Usuários

**Branch:** `feat/admin`  
**Objetivo:** Criar o painel exclusivo para administradores gerenciarem a plataforma.

### Entregáveis

**Página Admin (`src/pages/Admin.tsx`)**
- [ ] Rota `/app/admin` — visível apenas para `role === 'ADMIN'` via `RoleGuard`
- [ ] Abas: Usuários | Auditoria | Configurações

**Gestão de Usuários**
- [ ] `UserList.tsx` — lista todos os usuários com nome, cargo, status (ativo/inativo)
- [ ] `UserForm.tsx` — criar novo usuário (e-mail, nome, cargo, unidade)
- [ ] Desativar usuário — revogar acesso sem deletar histórico
- [ ] Alterar perfil de usuário (TECHNICIAN ↔ COORDINATOR)

**Auditoria**
- [ ] `AuditLog.tsx` — tabela com: ação, usuário, data/hora, dado afetado
- [ ] Filtros: por usuário, por tipo de ação, por intervalo de datas
- [ ] Exportar log em CSV

**Configurações**
- [ ] Nome da unidade / CREAS
- [ ] Logotipo para o PDF dos relatórios (upload de imagem)

### Commit Final

```
feat: add admin panel with user management, audit log and unit settings
```

---

## M13 — Polish, Acessibilidade & Responsividade

**Branch:** `feat/polish`  
**Objetivo:** Refinar a experiência final para produção.

### Entregáveis

**Micro-interações (Motion)**
- [ ] Sidebar — highlight deslizante no item ativo
- [ ] Abas de Casos — indicador de aba com slide horizontal
- [ ] Modal — slide-up 200ms ease-out na abertura
- [ ] Toast — slide-in da direita 300ms ease-out
- [ ] CaseCard — hover com `scale(1.01)` e sombra elevada

**Estados Vazios & Erros**
- [ ] `EmptyState` em todas as listas (Casos, Procedimentos, Alertas)
- [ ] Error Boundary global (`src/components/layout/ErrorBoundary.tsx`)
- [ ] Tela de 404 (`src/pages/NotFound.tsx`)
- [ ] Skeleton loaders para listas enquanto carregam

**Acessibilidade**
- [ ] Todos os modais com `role="dialog"` e `aria-label`
- [ ] Navegação por teclado: Tab, Escape para fechar modais
- [ ] Contraste de cores verificado (WCAG AA mínimo)
- [ ] `<title>` dinâmico por página

**Responsividade**
- [ ] Sidebar colapsa em hamburger menu em telas < 768px
- [ ] Tabelas com scroll horizontal em mobile
- [ ] Formulários com stack vertical em mobile
- [ ] Landing Page responsiva (mobile-first)

**Performance**
- [ ] Lazy loading de páginas com `React.lazy` + `Suspense`
- [ ] Memoização de listas pesadas com `useMemo`

### Commit Final

```
feat: polish UX with motion, empty states, error boundaries, a11y and responsiveness
```

---

## M14 — Deploy & CI/CD

**Branch:** `feat/deploy`  
**Objetivo:** Configurar o pipeline de entrega contínua e publicar em produção.

### Entregáveis

**Configuração de Ambiente**
- [ ] `.env.example` com todas as variáveis necessárias documentadas
- [ ] `.env.production` com valores reais (não comitar — adicionar ao `.gitignore`)
- [ ] Variáveis configuradas no painel da plataforma de deploy

**Vercel / Netlify**
- [ ] `vercel.json` ou `netlify.toml` com: build command `npm run build`, publish dir `dist`
- [ ] Regra de SPA redirect: `/*` → `/index.html` (para react-router funcionar)
- [ ] Domínio customizado configurado (se houver)
- [ ] HTTPS habilitado

**CI/CD (GitHub Actions)**
- [ ] `.github/workflows/ci.yml`:
  - [ ] Trigger: push em `main` e PRs
  - [ ] Jobs: install → lint → type-check → build
- [ ] `.github/workflows/deploy.yml`:
  - [ ] Trigger: push em `main`
  - [ ] Deploy automático para Vercel/Netlify via CLI

**Supabase Produção**
- [ ] Separar projetos Supabase: `dev` e `prod`
- [ ] Rodar migrations em produção via `supabase db push`
- [ ] Ativar proteção por senha no Supabase Studio

**Checklist Pré-Go-Live**
- [ ] `npm run build` sem warnings
- [ ] TypeScript sem erros (`tsc --noEmit`)
- [ ] ESLint sem erros
- [ ] Testar fluxo completo: login → criar caso → registrar procedimento → gerar RMA PDF
- [ ] Testar em Chrome, Firefox e Safari
- [ ] Testar em mobile (iOS Safari + Android Chrome)

### Commit Final

```
chore: configure production deployment, CI/CD pipeline and environment setup
```

---

## Fluxo de Branches

```
main
 └── setup/init                    (M0)
 └── feat/design-system            (M1)
 └── feat/landing-page             (M2)
 └── feat/auth-ui                  (M3)
 └── feat/cases-ui                 (M4)
 └── feat/procedures-ui            (M5)
 └── feat/reports-ui               (M6)
 └── feat/dashboard-ui             (M7)
 └── feat/supabase-auth            (M8)
 └── feat/supabase-cases           (M9)
 └── feat/supabase-reports         (M10)
 └── feat/notifications            (M11)
 └── feat/admin                    (M12)
 └── feat/polish                   (M13)
 └── feat/deploy                   (M14)
```

> Cada branch nasce de `main` atualizado e é mergeada via PR antes do próximo milestone começar.

---

## Dependências Entre Milestones

```
M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7   (trilha de UI — sequencial)
                                           ↓
                              M8 → M9 → M10 → M11 → M12  (trilha de backend)
                                                          ↓
                                                        M13 → M14
```

> M8 pode começar após M7 estar mergeado. M13 só após todos os M8-M12 estarem estáveis.
