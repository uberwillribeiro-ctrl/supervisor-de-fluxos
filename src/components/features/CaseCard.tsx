import { MapPin, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { InactivityAlert } from './InactivityAlert';
import { type CaseRecord, CaseStatus, CASE_STATUS_LABELS } from '@/types/case';
import { isInactive, daysWithoutReport } from '@/utils/caseUtils';
import { formatRelative } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

const STATUS_BADGE_VARIANTS: Record<CaseStatus, 'novo' | 'ativo' | 'arquivado'> = {
  [CaseStatus.NEW]: 'novo',
  [CaseStatus.ACTIVE]: 'ativo',
  [CaseStatus.ARCHIVED]: 'arquivado',
};

interface CaseCardProps {
  caseRecord: CaseRecord;
  onClick: (c: CaseRecord) => void;
}

export function CaseCard({ caseRecord: c, onClick }: CaseCardProps) {
  const inactive = isInactive(c);
  const days = inactive ? daysWithoutReport(c) : 0;

  return (
    <button
      onClick={() => onClick(c)}
      className={cn(
        'w-full text-left rounded-xl bg-slate-900 ring-1 transition-all duration-150',
        'hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        inactive
          ? 'ring-amber-500/40 hover:ring-amber-400/60'
          : 'ring-slate-800 hover:ring-slate-600',
      )}
    >
      <div className="p-4 space-y-3">
        {/* Linha superior: código + serviço + status */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-slate-500">{c.code}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 bg-slate-800 rounded px-1.5 py-0.5">
              {c.service}
            </span>
            <Badge variant={STATUS_BADGE_VARIANTS[c.status]}>{CASE_STATUS_LABELS[c.status]}</Badge>
          </div>
        </div>

        {/* Nome */}
        <p className="text-sm font-semibold text-slate-100 leading-snug">{c.name}</p>

        {/* Detalhes */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.5} />
            <span>{c.neighborhood}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User className="size-3.5 shrink-0" strokeWidth={1.5} />
            <span>{c.responsibleName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="size-3.5 shrink-0" strokeWidth={1.5} />
            <span>
              {c.lastReportDate
                ? `Último relatório: ${formatRelative(c.lastReportDate)}`
                : 'Sem relatórios registrados'}
            </span>
          </div>
        </div>

        {/* Alerta de inatividade */}
        {inactive && <InactivityAlert days={days} />}
      </div>
    </button>
  );
}
