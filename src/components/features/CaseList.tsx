import { useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { CaseCard } from './CaseCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { type CaseRecord } from '@/types/case';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 10;

interface CaseListProps {
  cases: CaseRecord[];
  onSelectCase: (c: CaseRecord) => void;
  emptyMessage?: string;
}

export function CaseList({
  cases,
  onSelectCase,
  emptyMessage = 'Nenhum caso encontrado.',
}: CaseListProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(cases.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = cases.slice(start, start + PAGE_SIZE);

  if (cases.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900 ring-1 ring-slate-800">
        <EmptyState icon={Users} title="Nenhum caso" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid de cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {pageItems.map((c) => (
          <CaseCard key={c.id} caseRecord={c} onClick={onSelectCase} />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500">
            {start + 1}–{Math.min(start + PAGE_SIZE, cases.length)} de {cases.length} casos
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                'flex items-center justify-center size-8 rounded-lg text-slate-400 transition-colors',
                'hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed',
              )}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-2 text-xs font-medium text-slate-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'flex items-center justify-center size-8 rounded-lg text-slate-400 transition-colors',
                'hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed',
              )}
              aria-label="Próxima página"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
