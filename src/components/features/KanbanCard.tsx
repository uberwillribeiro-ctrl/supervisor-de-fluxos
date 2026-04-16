import { MapPin, Clock, AlertTriangle, GripVertical, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type CaseRecord } from '@/types/case';
import { isInactive, daysWithoutReport } from '@/utils/caseUtils';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

// ─── Chip de serviço ──────────────────────────────────────────────────────────

const SERVICE_STYLES: Record<string, string> = {
  PAEFI: 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20',
  SEV: 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20',
};

// ─── Avatar do responsável ────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Gera cor determinística a partir do nome
  const hue = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <span
      className="inline-flex items-center justify-center size-5 rounded-full text-[9px] font-bold text-white shrink-0"
      style={{ background: `hsl(${hue} 55% 42%)` }}
      title={name}
    >
      {initials}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface KanbanCardProps {
  caseRecord: CaseRecord;
  onClick: (c: CaseRecord) => void;
  /** Quando true, renderiza somente o visual sem DnD (usado no drag overlay) */
  overlay?: boolean;
}

export function KanbanCard({ caseRecord: c, onClick, overlay = false }: KanbanCardProps) {
  const inactive = isInactive(c);
  const days = inactive ? daysWithoutReport(c) : 0;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: c.id,
    disabled: overlay,
  });

  const style = overlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  return (
    <motion.div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      layout={!overlay}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative rounded-2xl border bg-[#161b26] transition-all duration-200',
        'select-none',
        inactive
          ? 'border-amber-500/30 shadow-[0_0_16px_-4px_rgba(245,158,11,0.18)]'
          : 'border-white/[0.06] hover:border-white/[0.12]',
        isDragging && 'opacity-40 scale-[0.98]',
        overlay && 'shadow-2xl shadow-black/60 rotate-1 border-indigo-500/40 scale-[1.03]',
      )}
    >
      {/* Accent bar de alerta */}
      {inactive && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />
      )}

      {/* Grip handle */}
      {!overlay && (
        <button
          {...attributes}
          {...listeners}
          aria-label="Arrastar card"
          className={cn(
            'absolute right-2.5 top-2.5 p-1 rounded-lg',
            'text-slate-700 hover:text-slate-400 hover:bg-white/5',
            'opacity-0 group-hover:opacity-100 transition-all duration-150',
            'cursor-grab active:cursor-grabbing focus:outline-none',
            'touch-none',
          )}
        >
          <GripVertical className="size-3.5" strokeWidth={1.5} />
        </button>
      )}

      {/* Conteúdo clicável */}
      <button
        onClick={() => onClick(c)}
        className="w-full text-left p-3.5 space-y-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
      >
        {/* Linha 1: código + serviço */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] tracking-widest text-slate-600 uppercase">
            {c.code}
          </span>
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none',
              SERVICE_STYLES[c.service] ?? 'bg-slate-700 text-slate-400',
            )}
          >
            {c.service}
          </span>
        </div>

        {/* Nome */}
        <p className="text-[13px] font-semibold text-slate-100 leading-snug line-clamp-2 pr-4">
          {c.name}
        </p>

        {/* Metadados */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="size-3 shrink-0 text-slate-600" strokeWidth={1.5} />
            <span className="truncate">{c.neighborhood}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="size-3 shrink-0 text-slate-600" strokeWidth={1.5} />
            <span>Entrada: {formatDate(c.entryDate)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.04]" />

        {/* Footer: avatar + último relatório / alerta */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar name={c.responsibleName} />
            <span className="text-[10px] text-slate-500 truncate">{c.responsibleName}</span>
          </div>

          {inactive ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 shrink-0">
              <AlertTriangle className="size-3" strokeWidth={2.5} />
              {days}d
            </span>
          ) : c.lastReportDate ? (
            <span className="flex items-center gap-1 text-[10px] text-slate-600 shrink-0">
              <Clock className="size-3" strokeWidth={1.5} />
              {formatRelative(c.lastReportDate)}
            </span>
          ) : (
            <span className="text-[10px] text-slate-700 shrink-0">Sem relatório</span>
          )}
        </div>
      </button>
    </motion.div>
  );
}

// ─── Ghost slot (onde o card vai cair) ───────────────────────────────────────

export function KanbanCardGhost() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 h-[140px]" />
  );
}

// ─── Card sem DnD (para o overlay de arrasto) ────────────────────────────────

export function KanbanCardStatic({ caseRecord, onClick }: Omit<KanbanCardProps, 'overlay'>) {
  const inactive = isInactive(caseRecord);
  const c = caseRecord;

  return (
    <div
      className={cn(
        'relative rounded-2xl border bg-[#161b26] shadow-2xl shadow-black/60 rotate-1 scale-[1.03]',
        inactive ? 'border-amber-500/30' : 'border-indigo-500/40',
      )}
    >
      {inactive && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />
      )}
      <button onClick={() => onClick(c)} className="w-full text-left p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] tracking-widest text-slate-600 uppercase">
            {c.code}
          </span>
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none',
              SERVICE_STYLES[c.service] ?? 'bg-slate-700 text-slate-400',
            )}
          >
            {c.service}
          </span>
        </div>
        <p className="text-[13px] font-semibold text-slate-100 leading-snug line-clamp-2">
          {c.name}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="size-3 shrink-0 text-slate-600" strokeWidth={1.5} />
            <span>{c.neighborhood}</span>
          </div>
        </div>
        <div className="border-t border-white/[0.04]" />
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar name={c.responsibleName} />
          <span className="text-[10px] text-slate-500 truncate">{c.responsibleName}</span>
        </div>
      </button>
    </div>
  );
}
