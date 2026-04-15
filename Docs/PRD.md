# PRD — Supervisor de Fluxos

**Versão:** 1.0  
**Data:** 2026-04-15  
**Autor:** —  
**Status:** Aprovado

---

## 1. Context & Problem

O Supervisor de Fluxos não é apenas um banco de dados; ele é uma ferramenta de sobrevivência burocrática e eficiência social.

### O Problema Identificado: O "Caos do Papel" e a "Cegueira Estatística"

Em centros como o CREAS, a gestão de casos (PAEFI/SEV) frequentemente sofre com:

- **Fragmentação de Dados:** Informações espalhadas em fichas de papel, planilhas de Excel soltas e anotações manuais.
- **O "Pesadelo do RMA":** O Relatório Mensal de Atendimento (RMA) é uma exigência federal complexa. Gerá-lo manualmente no final do mês consome dias de trabalho técnico, exigindo a contagem manual de cada atendimento por faixa etária, sexo e tipo de violência.
- **Perda de Histórico:** Dificuldade em rastrear a evolução de um caso (quando entrou, por que foi arquivado, quais procedimentos foram feitos) ao longo de meses ou anos.

### A Dor Real

A dor é a **Sobrecarga Burocrática que paralisa o Trabalho Técnico**.

Quando um assistente social ou psicólogo gasta 30% do seu mês apenas "somando números" para relatórios, ele está deixando de atender famílias. A dor real é o tempo roubado do atendimento humano pela burocracia estatal.

### Impacto Específico

| Automação | Impacto |
|---|---|
| RMA automático | O que levava dias agora leva segundos. Devolução de tempo qualificado à equipe técnica. |
| Observatório Quantitativo | Visão clara de casos novos, ativos e desligados. Identificação de gargalos por bairro. |
| Rastreabilidade | Centralização por CPF e Código evita duplicidade e preserva histórico mesmo com rotatividade. |
| Precisão em Vulnerabilidades | Isolamento automático de dados críticos (mulheres vítimas de violência, crianças 0-10 anos). |

---

## 2. Proposed Solution

A solução é o **Supervisor de Fluxos**, uma plataforma digital inteligente de gestão e monitoramento para serviços de Proteção Social Especial (CREAS). Ela substitui o fluxo manual e fragmentado por um ecossistema centralizado e automatizado.

### Os Três Pilares

1. **Módulo de Gestão de Casos (Prontuário Digital):** Dossiê digital por família/indivíduo com histórico completo desde a entrada como "Caso Novo" até o arquivamento.
2. **Módulo de Registro de Procedimentos:** Interface de lançamento diário para registro de visitas, atendimentos e encaminhamentos.
3. **Motor de Inteligência Estatística:** Processa dados brutos em tempo real — faixas etárias, cruzamento de gêneros, tipos de violação de direitos.

### Como Resolve o Problema

**A. Da Contagem Manual para a Automação Instantânea**  
O gerador de relatórios (RMA e Máscaras) consolida todos os procedimentos do mês em um clique. Identifica automaticamente crianças 0-10, adolescentes 11-17 e mulheres vítimas de violência.

**B. Da Fragmentação para a Centralização (Single Source of Truth)**  
Supabase como banco de dados em nuvem garante que coordenação e equipe técnica vejam a mesma informação em tempo real.

**C. Do "Esquecimento" para a Gestão de Fluxo**  
Interface divide os casos em abas claras: **Novos**, **Ativos** e **Arquivados**. Data do "Último Relatório" visível na listagem permite identificar casos sem acompanhamento.

**D. Da Insegurança para a Rastreabilidade**  
Cada registro carrega o nome do profissional e a data de criação. Busca por Código ou CPF recupera anos de histórico em segundos.

### Diferencial Estratégico

Desenhado especificamente para a linguagem do SUAS (Sistema Único de Assistência Social). Entende PAEFI, SEV e as métricas exigidas pelo Ministério — tornando a ferramenta uma extensão natural do trabalho técnico.

---

## 3. Functional Requirements

### Módulos Principais

- Login e Autenticação
- Multi-usuário com Permissões por Perfil
- Calendário
- Busca e Filtros Avançados
- Landing Page
- Onboarding do Usuário
- Dashboards
- Notificações
- Integrações (API)
- Upload de Arquivos
- Relatórios e Exportação (RMA, Máscaras)
- Chat / Mensagens

### Detalhamento Funcional

#### 1. Gestão Dinâmica de Ciclo de Vida do Caso

- **Abas de Fluxo:** Novos / Ativos / Arquivados
- **Controle de Inatividade:** Data do "Último Relatório" na listagem como alerta visual
- **Arquivamento Inteligente:** Solicita motivo de desligamento e data, alimentando estatísticas de evasão/conclusão

#### 2. Registro de Procedimentos com Mapeamento RMA

- **Lançamento Simplificado:** Técnico registra a ação; sistema mapeia para a célula correta do relatório oficial
- **Cálculo Automático de Faixa Etária:** Distribuição automática entre "0-10 anos" e "11-17 anos"
- **Vinculação Direta:** Cada procedimento amarrado a um caso específico

#### 3. Motor de Relatórios e Observatório Quantitativo

- **Geração de RMA em PDF:** Processamento em browser com jsPDF, privacidade garantida
- **Máscaras de Registro Mensal:** Formatação para impressão conforme padrões SUAS
- **Observatório Quantitativo:** Saldo de casos (Entradas vs. Saídas), medindo resolutividade da unidade

#### 4. Busca Inteligente e Autopreenchimento

- **Recuperação por Código:** Preenchimento automático de nome, perfil, idade e endereço
- **Normalização de Busca:** Ignora acentos e maiúsculas/minúsculas
- **Filtros Avançados:** Mês de Referência, Ano, Bairro, Profissional Responsável

#### 5. Segurança e Privacidade

- **Controle de Perfil (Admin/User):** Admins veem toda equipe; técnicos focam em seus casos
- **Rastreabilidade de Ações:** Registro de quem criou cada dado (segurança jurídica)
- **Persistência em Nuvem:** Supabase elimina risco de perda por falha local
- **Modo Debug:** Suporte técnico e migração de dados facilitados

---

## 4. User Personas

### Perfil 1 — Técnico de Referência (Persona de Execução)

**Quem é:** Assistentes Sociais, Psicólogos, Pedagogos

**Objetivo:** Organizar demanda e eliminar contagem manual

**Uso Principal:**
- Lançamento diário de procedimentos
- Consulta rápida ao histórico antes de atendimento
- Verificação de casos "parados" ou desatualizados

### Perfil 2 — Coordenador / Supervisor (Persona de Gestão)

**Quem é:** Coordenador da unidade ou Supervisor Técnico

**Objetivo:** Visão macro para tomada de decisões baseada em dados

**Uso Principal:**
- Geração e conferência do RMA para envio ao Ministério/Secretaria
- Análise do Observatório Quantitativo por bairro
- Monitoramento do tempo de permanência dos casos

### Perfil 3 — Administrador do Sistema (Persona de Controle)

**Quem é:** Responsável de TI da Secretaria ou técnico designado

**Objetivo:** Integridade, segurança e manutenção da plataforma

**Uso Principal:**
- Criação e desativação de contas de usuários
- Auditoria de registros (quem inseriu o quê e quando)
- Gestão de backups e configurações de segurança (RLS)

### Resumo por Perfil

| Perfil | Necessidade Primária | Entrega do Sistema |
|---|---|---|
| Técnico | Agilidade e Organização | Fim das planilhas manuais e histórico centralizado |
| Coordenador | Visibilidade e Conformidade | Relatórios automáticos e estatísticas de impacto social |
| Administrador | Segurança e Estabilidade | Controle de acesso e proteção de dados sensíveis (PII) |

---

## 5. Technical Stack

### Frontend

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19 | UI reativa, gerenciamento de estado eficiente |
| Vite | 6 | Build ultrarrápido, HMR instantâneo |
| TypeScript | 5.x | Tipagem estrita, redução de erros em produção |

### Estilização e UX

| Tecnologia | Papel |
|---|---|
| Tailwind CSS 4 | Estilização utilitária, design responsivo |
| Motion (Framer Motion) | Transições de abas e modais |
| Lucide React | Ícones consistentes e leves |

### Backend e Persistência

| Tecnologia | Papel |
|---|---|
| Supabase (PostgreSQL) | BaaS — banco relacional com integridade entre Casos e Procedimentos |
| Supabase Auth | Autenticação segura (e-mail + social) |
| Row Level Security (RLS) | Isolamento de dados por escopo de permissão |

### Relatórios e Utilidades

| Tecnologia | Papel |
|---|---|
| jsPDF + jspdf-autotable | Geração de RMA em PDF no browser |
| Intl API (JavaScript) | Formatação de datas e valores em pt-BR |

### Por que essa Stack?

Arquitetura serverless sem custo fixo de servidor, escalável conforme necessidade da Secretaria, com máxima segurança para dados sensíveis das famílias atendidas.

---

## 6. Design Language

### Referências Visuais

| Referência | Inspiração | Aplicação |
|---|---|---|
| Linear / Vercel | "Modern SaaS" — clareza, espaço em branco | Tipografia Inter, paleta Slate/Indigo, foco na informação |
| Stripe Dashboard | Tabelas e dados complexos | Bordas sutis, hover refinado, cores semânticas de status |
| Gov.uk Design System | Acessibilidade e hierarquia | Labels claros, sidebar de navegação, legibilidade máxima |
| Notion / Airtable | Flexibilidade e organização | Abas de Fluxo, busca global, filtros naturais |

### Princípios de Design

- **Trust & Action:** Indigo 600 como cor primária (estabilidade institucional); Emerald e Amber para ações positivas e alertas
- **Micro-interações:** Transições suaves 200ms ease-out em modais e trocas de aba
- **Cards e Sombras:** Shadow-sm para profundidade, separando fundo / tabela / modal
- **Semântica de Cor:** Verde = Ativo, Âmbar = Novo/Edição, Vermelho = Exclusão/Arquivado

---

## 7. Conventions

### Linguagem

- TypeScript strict mode (`"strict": true` no `tsconfig.json`)
- Proibido `any` — use `unknown` com type guard quando necessário

### Nomenclatura

| Contexto | Padrão | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `CaseCard.tsx`, `ProcedureForm.tsx` |
| Tipos e Interfaces | PascalCase | `CaseRecord`, `ProcedureType` |
| Funções e variáveis | camelCase | `formatDate`, `caseList` |
| Variáveis de ambiente | SCREAMING_SNAKE | `VITE_SUPABASE_URL` |
| Hooks customizados | camelCase com prefixo `use` | `useAuth`, `useCases` |

### Arquivos

- `.tsx` — todo componente React
- `.ts` — lógica, tipos, hooks, utilitários
- Um componente por arquivo; nome do arquivo = nome do componente

### Imports

- Alias `@/` apontando para `src/` (configurado em `vite.config.ts` via `resolve.alias`)
- Imports de terceiros antes de imports internos
- Sem imports circulares

### Estado

- Estado local: `useState` / `useReducer`
- Estado servidor: Supabase Realtime + queries diretas
- Sem Redux ou Zustand — manter simples

### Estilização

- Apenas classes Tailwind utilitárias
- Proibido: `style={{}}` inline, CSS Modules, CSS-in-JS
- Variantes de estado via `clsx` ou `cn` helper

### Linting / Formatação

- ESLint com plugin React + TypeScript
- Prettier (tab: 2 espaços, semicolons, aspas simples)
- Husky + lint-staged no pre-commit

---

## 8. Folder Structure

```
novo Supervisor de Fluxos - 2026/
├── Docs/
│   └── PRD.md                    # este arquivo
├── supabase/
│   └── migrations/               # SQL de schema (versionado)
├── public/                       # assets estáticos públicos
└── src/
    ├── assets/                   # imagens, ícones locais
    ├── components/
    │   ├── ui/                   # primitivas reutilizáveis
    │   │   ├── Button.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Badge.tsx
    │   │   └── ...
    │   ├── layout/               # estrutura da página
    │   │   ├── Sidebar.tsx
    │   │   ├── Header.tsx
    │   │   └── PageWrapper.tsx
    │   └── features/             # componentes de domínio
    │       ├── CaseCard.tsx
    │       ├── ProcedureForm.tsx
    │       ├── RMATable.tsx
    │       └── ...
    ├── hooks/                    # hooks customizados
    │   ├── useAuth.ts
    │   ├── useCases.ts
    │   └── useProcedures.ts
    ├── lib/
    │   ├── supabase.ts           # client init + typed DB helpers
    │   └── pdf.ts                # lógica de geração do RMA via jsPDF
    ├── pages/                    # componentes de rota
    │   ├── Dashboard.tsx
    │   ├── Cases.tsx
    │   ├── Reports.tsx
    │   └── ...
    ├── types/                    # interfaces e enums globais
    │   ├── case.ts
    │   ├── procedure.ts
    │   └── user.ts
    ├── utils/                    # funções puras
    │   ├── formatDate.ts
    │   ├── normalizeSearch.ts
    │   └── ageRange.ts
    └── main.tsx                  # entry point
```

---

## 9. Visual Identity Tokens

### Paleta de Cores

| Token | Tailwind | Hex | Uso |
|---|---|---|---|
| Primary | `indigo-600` | `#4F46E5` | Botões primários, nav ativo, links |
| Primary hover | `indigo-700` | `#4338CA` | Estado hover de primários |
| Success | `emerald-500` | `#10B981` | Badge "Ativo", confirmações |
| Warning | `amber-500` | `#F59E0B` | Badge "Novo", estados de edição |
| Danger | `red-500` | `#EF4444` | Excluir, badge "Arquivado" |
| Neutral bg | `slate-50` | `#F8FAFC` | Background de página |
| Surface | `white` | `#FFFFFF` | Cards, modais, linhas de tabela |
| Border | `slate-200` | `#E2E8F0` | Divisores, bordas de input |
| Text primary | `slate-900` | `#0F172A` | Títulos e texto principal |
| Text secondary | `slate-600` | `#475569` | Texto de suporte |
| Text muted | `slate-500` | `#64748B` | Labels, captions, placeholders |

### Tipografia

| Elemento | Classe Tailwind | Observação |
|---|---|---|
| Fonte base | `font-sans` (Inter) | Carregar via Google Fonts |
| Heading 1 | `text-2xl font-bold` | Títulos de página |
| Heading 2 | `text-xl font-semibold` | Seções e cards |
| Body | `text-sm` | Conteúdo padrão de tabelas e formulários |
| Caption | `text-xs text-slate-500` | Labels, metadados |

### Espaçamento e Forma

| Propriedade | Valor | Aplicação |
|---|---|---|
| Border radius cards | `rounded-lg` (8px) | Cards, inputs, botões |
| Border radius modal | `rounded-xl` (12px) | Modais e drawers |
| Shadow card | `shadow-sm` | Elevação de cards |
| Shadow modal | `shadow-md` | Elevação de modais |
| Padding card | `p-4` / `p-6` | Interno de cards |
| Gap de lista | `gap-3` / `gap-4` | Espaçamento entre itens |

### Motion

| Contexto | Duração | Easing |
|---|---|---|
| Troca de aba | 200ms | ease-out |
| Abertura de modal | 200ms | ease-out (slide-up) |
| Hover de botão | 150ms | ease-in-out |
| Toast / notificação | 300ms | ease-out (slide-in) |

---

## 10. Process / Milestones

- Decompor o build em marcos lógicos (etapas)
- Cada marco deve ser um incremento entregável e testável
- Priorizar funcionalidade core primeiro, iterar depois
- Testar cada marco antes de avançar para o próximo

### Marcos Sugeridos

| Marco | Entregável |
|---|---|
| M1 | Setup do projeto (Vite + React + TS + Tailwind + Supabase) |
| M2 | Autenticação (Login, Perfis, RLS no Supabase) |
| M3 | Gestão de Casos (CRUD + Abas de Fluxo) |
| M4 | Registro de Procedimentos + Mapeamento RMA |
| M5 | Geração de RMA em PDF + Máscaras |
| M6 | Observatório Quantitativo + Dashboard |
| M7 | Busca Inteligente + Filtros Avançados |
| M8 | Notificações + Polish de UX |
