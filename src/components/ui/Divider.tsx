import { cn } from '@/utils/cn';

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 border-t border-slate-700" />
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <div className="flex-1 border-t border-slate-700" />
      </div>
    );
  }

  return <hr className={cn('border-t border-slate-700', className)} />;
}
