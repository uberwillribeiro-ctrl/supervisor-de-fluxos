import { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Inbox, CheckCircle2, AlertTriangle, Archive, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KanbanColumn, type KanbanColumnConfig } from './KanbanColumn';
import { KanbanCardStatic } from './KanbanCard';
import { type CaseRecord, CaseStatus, ENTRY_REASON_OPTIONS } from '@/types/case';
import { type UserProfile } from '@/types/user';
import { isInactive } from '@/utils/caseUtils';
import { cn } from '@/utils/cn';

// ─── Configuração das colunas ─────────────────────────────────────────────────

const COLUMN_CONFIGS: KanbanColumnConfig[] = [
  {
    id: CaseStatus.NEW,
    label: 'Acolhimento',
    accentText: 'text-amber-400',
    dotColor: 'bg-amber-400',
    counterStyle: 'bg-amber-400/10 text-amber-300',
    accentLine: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500',
    icon: <Inbox className="size-3.5" strokeWidth={1.75} />,
    addColor: 'text-amber-400',
  },
  {
    id: 'ACTIVE_OK',
    label: 'Acompanhamento',
    accentText: 'text-indigo-400',
    dotColor: 'bg-indigo-400',
    counterStyle: 'bg-indigo-400/10 text-indigo-300',
    accentLine: 'bg-gradient-to-r from-indigo-500 via-violet-400 to-indigo-500',
    icon: <CheckCircle2 className="size-3.5" strokeWidth={1.75} />,
    addColor: 'text-indigo-400',
  },
  {
    id: 'ACTIVE_ALERT',
    label: 'Em Alerta',
    accentText: 'text-rose-400',
    dotColor: 'bg-rose-400',
    counterStyle: 'bg-rose-400/10 text-rose-300',
    accentLine: 'bg-gradient-to-r from-rose-600 via-red-400 to-rose-600',
    icon: <AlertTriangle className="size-3.5" strokeWidth={1.75} />,
    addColor: 'text-rose-400',
  },
  {
    id: CaseStatus.ARCHIVED,
    label: 'Arquivados',
    accentText: 'text-slate-400',
    dotColor: 'bg-slate-500',
    counterStyle: 'bg-slate-500/10 text-slate-400',
    accentLine: 'bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600',
    icon: <Archive className="size-3.5" strokeWidth={1.75} />,
    addColor: 'text-slate-400',
  },
];

// ─── Helper: CaseRecord → coluna virtual ─────────────────────────────────────

function getColumnId(c: CaseRecord): string {
  if (c.status === CaseStatus.NEW) return CaseStatus.NEW;
  if (c.status === CaseStatus.ARCHIVED) return CaseStatus.ARCHIVED;
  return isInactive(c) ? 'ACTIVE_ALERT' : 'ACTIVE_OK';
}

// ─── Helper: coluna virtual → status ─────────────────────────────────────────

function columnToStatus(colId: string): CaseStatus {
  if (colId === CaseStatus.NEW) return CaseStatus.NEW;
  if (colId === CaseStatus.ARCHIVED) return CaseStatus.ARCHIVED;
  return CaseStatus.ACTIVE; // ACTIVE_OK e ACTIVE_ALERT
}

// ─── Formulário de criação rápida ─────────────────────────────────────────────

interface QuickAddFormProps {
  technicians: UserProfile[];
  nextCode: string;
  currentUserId: string;
  onSave: (c: CaseRecord) => void;
  onClose: () => void;
}

const NEIGHBORHOODS = [
  'Bela Vista',
  'Bom Retiro',
  'Campos Elíseos',
  'Centro',
  'Jardim América',
  'Nova Esperança',
  'Parque das Flores',
  'Santa Cruz',
  'São José',
  'Vila Operária',
];

function QuickAddForm({
  technicians,
  nextCode,
  currentUserId,
  onSave,
  onClose,
}: QuickAddFormProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [service, setService] = useState<'PAEFI' | 'SEV' | ''>('');
  const [responsibleId, setResponsibleId] = useState('');
  const [entryReason, setEntryReason] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !service || !responsibleId || !neighborhood || !entryReason || !birthDate) {
      setError('Preencha: nome, data de nascimento, bairro, serviço, responsável e motivo.');
      return;
    }
    const responsible = technicians.find((t) => t.id === responsibleId)!;
    const today = new Date().toISOString().split('T')[0];
    onSave({
      id: `case-${Date.now()}`,
      code: nextCode,
      name: name.trim(),
      cpf: cpf.trim() || '000.000.000-00',
      birthDate,
      address: address.trim() || 'Não informado',
      neighborhood,
      service: service as 'PAEFI' | 'SEV',
      status: CaseStatus.NEW,
      entryDate: today,
      entryReason,
      responsibleId,
      responsibleName: responsible.name,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
    });
  };

  const fieldCls = cn(
    'w-full h-8 px-2.5 rounded-lg text-xs text-slate-200',
    'bg-white/[0.04] border border-white/[0.08]',
    'placeholder:text-slate-600',
    'focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30',
    'transition-colors',
  );
  const selectCls = cn(fieldCls, 'appearance-none cursor-pointer');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-[#0d1117] border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header do form */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="size-3.5 text-indigo-400" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Novo Caso</p>
              <p className="text-[10px] text-slate-500 font-mono">{nextCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Fields */}
        <div className="p-5 space-y-3">
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Nome completo <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Nome do beneficiário"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setError('');
              }}
              className={fieldCls}
              autoFocus
            />
          </div>

          {/* CPF + Data nascimento */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                CPF
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
                className={fieldCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Nascimento <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setBirthDate(e.target.value);
                  setError('');
                }}
                className={cn(fieldCls, 'text-slate-400')}
              />
            </div>
          </div>

          {/* Serviço + Bairro */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Serviço <span className="text-rose-400">*</span>
              </label>
              <select
                value={service}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setService(e.target.value as 'PAEFI' | 'SEV');
                  setError('');
                }}
                className={selectCls}
              >
                <option value="">Selecione</option>
                <option value="PAEFI">PAEFI</option>
                <option value="SEV">SEV</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Bairro <span className="text-rose-400">*</span>
              </label>
              <select
                value={neighborhood}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setNeighborhood(e.target.value);
                  setError('');
                }}
                className={selectCls}
              >
                <option value="">Selecione</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Endereço
            </label>
            <input
              type="text"
              placeholder="Rua, número"
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
              className={fieldCls}
            />
          </div>

          {/* Responsável */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Responsável <span className="text-rose-400">*</span>
            </label>
            <select
              value={responsibleId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setResponsibleId(e.target.value);
                setError('');
              }}
              className={selectCls}
            >
              <option value="">Selecione o técnico</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Motivo da entrada */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              Motivo da entrada <span className="text-rose-400">*</span>
            </label>
            <select
              value={entryReason}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setEntryReason(e.target.value);
                setError('');
              }}
              className={selectCls}
            >
              <option value="">Selecione o motivo</option>
              {ENTRY_REASON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Erro */}
          {error && (
            <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-9 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-9 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Cadastrar Caso
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Estatísticas do board ────────────────────────────────────────────────────

function BoardStats({ cases }: { cases: CaseRecord[] }) {
  const total = cases.length;
  const active = cases.filter((c) => c.status === CaseStatus.ACTIVE).length;
  const alerts = cases.filter((c) => isInactive(c)).length;
  const archived = cases.filter((c) => c.status === CaseStatus.ARCHIVED).length;

  const stats = [
    { label: 'Total', value: total, color: 'text-slate-300' },
    { label: 'Ativos', value: active, color: 'text-indigo-400' },
    { label: 'Em alerta', value: alerts, color: 'text-rose-400' },
    { label: 'Arquivados', value: archived, color: 'text-slate-500' },
  ];

  return (
    <div className="flex items-center gap-4 mb-5">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          {i > 0 && <div className="w-px h-3.5 bg-white/[0.08]" />}
          <span className={cn('text-lg font-bold tabular-nums leading-none', s.color)}>
            {s.value}
          </span>
          <span className="text-[11px] text-slate-600 leading-none">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Board principal ──────────────────────────────────────────────────────────

interface KanbanBoardProps {
  cases: CaseRecord[];
  onSelectCase: (c: CaseRecord) => void;
  onCasesChange: (cases: CaseRecord[]) => void;
  technicians: UserProfile[];
  nextCode: string;
  currentUserId: string;
  onCaseCreate: (c: CaseRecord) => void;
}

export function KanbanBoard({
  cases,
  onSelectCase,
  onCasesChange,
  technicians,
  nextCode,
  currentUserId,
  onCaseCreate,
}: KanbanBoardProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Sensores: pointer com delay para não conflitar com clique; touch
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  // Distribui casos nas 4 colunas virtuais
  const columns = useMemo(() => {
    const map: Record<string, CaseRecord[]> = {
      [CaseStatus.NEW]: [],
      ACTIVE_OK: [],
      ACTIVE_ALERT: [],
      [CaseStatus.ARCHIVED]: [],
    };
    for (const c of cases) {
      map[getColumnId(c)].push(c);
    }
    return map;
  }, [cases]);

  // Card sendo arrastado
  const activeDragCase = useMemo(
    () => (activeDragId ? (cases.find((c) => c.id === activeDragId) ?? null) : null),
    [activeDragId, cases],
  );

  // ─── Handlers DnD ─────────────────────────────────────────────────────────

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const overId = event.over?.id;
      if (!overId) {
        setOverColumnId(null);
        return;
      }

      // Se o over é uma coluna
      const isColumn = COLUMN_CONFIGS.some((col) => col.id === overId);
      if (isColumn) {
        setOverColumnId(String(overId));
        return;
      }

      // Se o over é um card, descobrimos a coluna pelo caso
      const overCase = cases.find((c) => c.id === overId);
      if (overCase) {
        setOverColumnId(getColumnId(overCase));
        return;
      }

      setOverColumnId(null);
    },
    [cases],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      setOverColumnId(null);

      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      const activeCase = cases.find((c) => c.id === activeId);
      if (!activeCase) return;

      // Determina coluna de destino
      const isColumn = COLUMN_CONFIGS.some((col) => col.id === overId);
      const targetColumnId = isColumn ? overId : getColumnId(cases.find((c) => c.id === overId)!);

      const sourceColumnId = getColumnId(activeCase);
      const newStatus = columnToStatus(targetColumnId);

      if (sourceColumnId === targetColumnId) {
        // Reordenar dentro da mesma coluna
        const colCases = columns[sourceColumnId];
        const oldIndex = colCases.findIndex((c) => c.id === activeId);
        const newIndex = isColumn
          ? colCases.length - 1
          : colCases.findIndex((c) => c.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = arrayMove(colCases, oldIndex, newIndex);

        const updatedCases = cases.map((c) => {
          const found = reordered.find((r) => r.id === c.id);
          return found ?? c;
        });
        onCasesChange(updatedCases);
      } else {
        // Mover para outra coluna: atualiza status
        const today = new Date().toISOString().split('T')[0];
        const updatedCases = cases.map((c) =>
          c.id === activeId
            ? {
                ...c,
                status: newStatus,
                // Ao mover para ACTIVE_OK, registra relatório hoje para sair do alerta
                ...(targetColumnId === 'ACTIVE_OK' && { lastReportDate: today }),
                // Limpa metadados de arquivamento ao sair de ARCHIVED
                ...(newStatus !== CaseStatus.ARCHIVED && {
                  archiveDate: undefined,
                  archiveReason: undefined,
                  archiveNotes: undefined,
                }),
              }
            : c,
        );
        onCasesChange(updatedCases);
      }
    },
    [cases, columns, onCasesChange],
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Estatísticas */}
      <BoardStats cases={cases} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-x-auto pb-6"
          style={{ cursor: activeDragId ? 'grabbing' : 'default' }}
        >
          <div className="flex gap-4 min-w-max pr-4">
            {COLUMN_CONFIGS.map((col) => (
              <KanbanColumn
                key={col.id}
                config={col}
                cases={columns[col.id]}
                onSelectCase={onSelectCase}
                onAddCase={col.id === CaseStatus.NEW ? () => setShowQuickAdd(true) : undefined}
                isOver={overColumnId === col.id}
              />
            ))}
          </div>
        </motion.div>

        {/* Drag overlay: card "fantasma" que segue o cursor */}
        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {activeDragCase ? (
            <KanbanCardStatic caseRecord={activeDragCase} onClick={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Formulário de criação rápida */}
      <AnimatePresence>
        {showQuickAdd && (
          <QuickAddForm
            technicians={technicians}
            nextCode={nextCode}
            currentUserId={currentUserId}
            onSave={(c) => {
              onCaseCreate(c);
              setShowQuickAdd(false);
            }}
            onClose={() => setShowQuickAdd(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
