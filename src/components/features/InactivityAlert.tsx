import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InactivityAlertProps {
  days: number;
  className?: string;
}

export function InactivityAlert({ days, className }: InactivityAlertProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5',
        'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
        className,
      )}
    >
      <AlertTriangle className="size-3.5 shrink-0" strokeWidth={2} />
      <span className="text-xs font-medium">Sem relatório há {days} dias</span>
    </div>
  );
}
