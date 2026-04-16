import { type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'motion/react';
import { KanbanCard } from './KanbanCard';
import { type CaseRecord } from '@/types/case';
import { cn } from '@/utils/cn';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface KanbanColumnConfig {
  id: string;
  label: string;
  /** Classe de cor para o dot e texto do header */
  accentText: string;
  /** Classe de cor do dot */
  dotColor: string;
  /** Classe bg+text para o badge contador */
  counterStyle: string;
  /** Classe do gradiente top accent line */
  accentLine: string;
  /** Ícone */
  icon: ReactNode;
  /** Cor do "+" para adicionar */
  addColor: string;
}

interface KanbanColumnProps {
  config: KanbanColumnConfig;
  cases: CaseRecord[];
  onSelectCase: (c: CaseRecord) => void;
  onAddCase?: () => void;
  isOver?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function KanbanColumn({
  config,
  cases,
  onSelectCase,
  onAddCase,
  isOver,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: config.id });
  const cardIds = cases.map((c) => c.id);

  return (
    <div
      className={cn(
        'flex flex-col w-[288px] shrink-0 rounded-2xl',
        'border transition-colors duration-200',
        isOver ? 'border-indigo-500/50 bg-[#0f1420]' : 'border-white/[0.06] bg-[#0d1117]',
      )}
      style={{ minHeight: 480, maxHeight: 'calc(100vh - 200px)' }}
    >
      {/* Accent line */}
      <div className={cn('h-0.5 w-full rounded-t-2xl', config.accentLine)} />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Dot + ícone */}
          <div
            className={cn(
              'flex items-center justify-center size-7 rounded-xl bg-white/[0.04] border border-white/[0.06]',
              config.accentText,
            )}
          >
            {config.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-200 leading-none truncate">
              {config.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Contador */}
          <span
            className={cn(
              'text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full',
              config.counterStyle,
            )}
          >
            {cases.length}
          </span>

          {/* Botão adicionar */}
          {onAddCase && (
            <button
              onClick={onAddCase}
              aria-label={`Adicionar caso em ${config.label}`}
              className={cn(
                'flex items-center justify-center size-6 rounded-lg',
                'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]',
                'transition-colors duration-150',
                config.accentText,
              )}
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Separador */}
      <div className="mx-4 h-px bg-white/[0.04]" />

      {/* Drop zone + cards */}
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 overflow-y-auto p-3 space-y-2.5',
            'scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent',
            isOver && 'bg-indigo-500/[0.03] rounded-b-2xl',
          )}
        >
          <AnimatePresence initial={false}>
            {cases.length === 0 ? (
              <div
                className={cn(
                  'flex flex-col items-center justify-center py-10 px-4 rounded-xl',
                  'border border-dashed transition-colors duration-200',
                  isOver ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/[0.06]',
                )}
              >
                <span className={cn('text-[11px] text-slate-600', isOver && 'text-indigo-400/60')}>
                  {isOver ? 'Soltar aqui' : 'Nenhum caso'}
                </span>
              </div>
            ) : (
              cases.map((c) => <KanbanCard key={c.id} caseRecord={c} onClick={onSelectCase} />)
            )}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}
