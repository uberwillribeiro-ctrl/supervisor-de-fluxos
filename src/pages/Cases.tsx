import { useState, useMemo, type ChangeEvent } from 'react';
import { Plus, Search, LayoutList, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { CaseList } from '@/components/features/CaseList';
import { KanbanBoard } from '@/components/features/KanbanBoard';
import { CaseForm } from '@/components/features/CaseForm';
import { CaseDetail } from '@/components/features/CaseDetail';
import { ArchiveModal } from '@/components/features/ArchiveModal';
import { type CaseRecord, CaseStatus } from '@/types/case';
import { MOCK_CASES, MOCK_TECHNICIANS } from '@/lib/mockData';
import { matchesSearch } from '@/utils/normalizeSearch';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

// ─── Configuração das abas ────────────────────────────────────────────────────

const TABS: { id: CaseStatus; label: string; variant: 'novo' | 'ativo' | 'arquivado' }[] = [
  { id: CaseStatus.NEW, label: 'Novos', variant: 'novo' },
  { id: CaseStatus.ACTIVE, label: 'Ativos', variant: 'ativo' },
  { id: CaseStatus.ARCHIVED, label: 'Arquivados', variant: 'arquivado' },
];

const EMPTY_MESSAGES: Record<CaseStatus, (filtered: boolean) => string> = {
  [CaseStatus.NEW]: (f) =>
    f ? 'Nenhum caso novo corresponde ao filtro.' : 'Nenhum caso novo cadastrado.',
  [CaseStatus.ACTIVE]: (f) =>
    f ? 'Nenhum caso ativo corresponde ao filtro.' : 'Nenhum caso ativo no momento.',
  [CaseStatus.ARCHIVED]: (f) =>
    f ? 'Nenhum caso arquivado corresponde ao filtro.' : 'Nenhum caso arquivado.',
};

// ─── Página ───────────────────────────────────────────────────────────────────

export default function Cases() {
  const { user } = useAuth();
  const { success } = useToast();

  // View mode: 'list' | 'kanban'
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>(() => {
    try {
      return (localStorage.getItem('cases-view-mode') as 'list' | 'kanban') ?? 'list';
    } catch {
      return 'list';
    }
  });

  const handleSetViewMode = (mode: 'list' | 'kanban') => {
    setViewMode(mode);
    try {
      localStorage.setItem('cases-view-mode', mode);
    } catch {
      // ignore
    }
  };

  // Estado central
  const [cases, setCases] = useState<CaseRecord[]>(MOCK_CASES);
  const [activeTab, setActiveTab] = useState<CaseStatus>(CaseStatus.NEW);
  const [searchQuery, setSearchQuery] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');

  // Modais
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [archivingCase, setArchivingCase] = useState<CaseRecord | null>(null);

  // Casos filtrados para a aba atual (view lista)
  const filteredCases = useMemo(() => {
    const isFiltered = Boolean(searchQuery || responsibleFilter);
    return {
      items: cases
        .filter((c) => c.status === activeTab)
        .filter((c) => {
          if (!searchQuery) return true;
          return (
            matchesSearch(c.name, searchQuery) ||
            matchesSearch(c.cpf, searchQuery) ||
            matchesSearch(c.code, searchQuery)
          );
        })
        .filter((c) => {
          if (!responsibleFilter) return true;
          return c.responsibleId === responsibleFilter;
        }),
      isFiltered,
    };
  }, [cases, activeTab, searchQuery, responsibleFilter]);

  // Casos filtrados para o Kanban (todos os status, sem filtro de aba)
  const kanbanCases = useMemo(
    () =>
      cases
        .filter((c) => {
          if (!searchQuery) return true;
          return (
            matchesSearch(c.name, searchQuery) ||
            matchesSearch(c.cpf, searchQuery) ||
            matchesSearch(c.code, searchQuery)
          );
        })
        .filter((c) => {
          if (!responsibleFilter) return true;
          return c.responsibleId === responsibleFilter;
        }),
    [cases, searchQuery, responsibleFilter],
  );

  // Contadores por aba
  const counts = useMemo(
    () => ({
      [CaseStatus.NEW]: cases.filter((c) => c.status === CaseStatus.NEW).length,
      [CaseStatus.ACTIVE]: cases.filter((c) => c.status === CaseStatus.ACTIVE).length,
      [CaseStatus.ARCHIVED]: cases.filter((c) => c.status === CaseStatus.ARCHIVED).length,
    }),
    [cases],
  );

  const nextCode = `CAS-${new Date().getFullYear()}-${String(cases.length + 1).padStart(4, '0')}`;

  // ─── Operações ───────────────────────────────────────────────────────────────

  const handleCreate = (newCase: CaseRecord) => {
    setCases((prev) => [newCase, ...prev]);
    setShowForm(false);
    setActiveTab(CaseStatus.NEW);
    success(`Caso "${newCase.name}" cadastrado com sucesso!`);
  };

  const handleArchive = (
    id: string,
    data: { archiveDate: string; archiveReason: string; archiveNotes: string },
  ) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: CaseStatus.ARCHIVED,
              archiveDate: data.archiveDate,
              archiveReason: data.archiveReason,
              archiveNotes: data.archiveNotes,
            }
          : c,
      ),
    );
    setArchivingCase(null);
    setSelectedCase(null);
    setActiveTab(CaseStatus.ARCHIVED);
    success('Caso arquivado com sucesso.');
  };

  const handleReactivate = (id: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: CaseStatus.ACTIVE,
              archiveDate: undefined,
              archiveReason: undefined,
              archiveNotes: undefined,
            }
          : c,
      ),
    );
    setSelectedCase(null);
    setActiveTab(CaseStatus.ACTIVE);
    success('Caso reativado com sucesso.');
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  const responsibleOptions = [
    { value: '', label: 'Todos os responsáveis' },
    ...MOCK_TECHNICIANS.map((t) => ({ value: t.id, label: t.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Gestão de Casos</h1>
          <p className="mt-0.5 text-sm text-slate-500">{cases.length} casos no sistema</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle de view */}
          <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5">
            <button
              aria-label="Visualização em lista"
              onClick={() => handleSetViewMode('list')}
              className={cn(
                'flex items-center justify-center size-7 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300',
              )}
            >
              <LayoutList className="size-3.5" strokeWidth={1.75} />
            </button>
            <button
              aria-label="Visualização Kanban"
              onClick={() => handleSetViewMode('kanban')}
              className={cn(
                'flex items-center justify-center size-7 rounded-md transition-colors',
                viewMode === 'kanban'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-500 hover:text-slate-300',
              )}
            >
              <LayoutGrid className="size-3.5" strokeWidth={1.75} />
            </button>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4 -ml-0.5 mr-1.5" strokeWidth={2} />
            Novo Caso
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou código..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className={cn(
              'h-9 w-full rounded-lg pl-9 pr-3 text-sm',
              'bg-slate-800 text-slate-100 placeholder:text-slate-600',
              'border border-slate-700',
              'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
              'transition-colors',
            )}
          />
        </div>
        <Select
          options={responsibleOptions}
          value={responsibleFilter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setResponsibleFilter(e.target.value)}
          className="sm:w-52"
        />
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (
          /* ── Kanban Board ────────────────────────────────────────────── */
          <KanbanBoard
            key="kanban"
            cases={kanbanCases}
            onSelectCase={setSelectedCase}
            onCasesChange={(updated) =>
              // Usa o array 'updated' como fonte de ordem e dados;
              // casos que não aparecem no updated são preservados no fim.
              setCases((prev) => {
                const updatedIds = new Set(updated.map((u) => u.id));
                const rest = prev.filter((c) => !updatedIds.has(c.id));
                return [...updated, ...rest];
              })
            }
            technicians={MOCK_TECHNICIANS}
            nextCode={nextCode}
            currentUserId={user?.id ?? 'admin'}
            onCaseCreate={handleCreate}
          />
        ) : (
          /* ── View Lista: abas + grid ─────────────────────────────────── */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Abas com indicador animado */}
            <div
              className="flex items-center gap-1 rounded-xl bg-slate-800/60 p-1 w-fit"
              role="tablist"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    activeTab === tab.id ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300',
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="cases-tab-indicator"
                      className="absolute inset-0 rounded-lg bg-slate-700 ring-1 ring-slate-600/50"
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  <Badge variant={tab.variant} className="relative z-10">
                    {counts[tab.id]}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Lista animada por aba */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <CaseList
                  key={`${activeTab}-${searchQuery}-${responsibleFilter}`}
                  cases={filteredCases.items}
                  onSelectCase={setSelectedCase}
                  emptyMessage={EMPTY_MESSAGES[activeTab](filteredCases.isFiltered)}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Novo Caso */}
      <CaseForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreate={handleCreate}
        nextCode={nextCode}
        currentUserId={user?.id ?? 'admin'}
        technicians={MOCK_TECHNICIANS}
      />

      {/* Modal: Detalhe do Caso */}
      <CaseDetail
        caseRecord={selectedCase}
        open={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
        onArchive={(c) => {
          setSelectedCase(null);
          setArchivingCase(c);
        }}
        onReactivate={handleReactivate}
      />

      {/* Modal: Arquivar */}
      <ArchiveModal
        open={archivingCase !== null}
        caseRecord={archivingCase}
        onClose={() => setArchivingCase(null)}
        onArchive={handleArchive}
      />
    </div>
  );
}
