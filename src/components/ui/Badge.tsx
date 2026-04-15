import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'novo' | 'ativo' | 'arquivado' | 'neutro' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  novo: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  ativo: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  arquivado: 'bg-red-500/15 text-red-400 ring-red-500/30',
  neutro: 'bg-slate-500/15 text-slate-400 ring-slate-500/30',
  info: 'bg-indigo-500/15 text-indigo-400 ring-indigo-500/30',
};

export function Badge({ variant = 'neutro', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
