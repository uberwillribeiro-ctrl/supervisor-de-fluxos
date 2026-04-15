import { Menu, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title: string;
  onOpenSidebar: () => void;
  className?: string;
}

export function Header({ title, onOpenSidebar, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 items-center gap-3 px-4',
        'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60',
        className,
      )}
    >
      {/* Hamburger — só mobile */}
      <button
        onClick={onOpenSidebar}
        className="md:hidden flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Título da página */}
      <h1 className="flex-1 text-sm font-semibold text-slate-200 truncate">{title}</h1>

      {/* Busca rápida */}
      <button
        className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors ring-1 ring-slate-700"
        aria-label="Buscar (Ctrl+K)"
      >
        <Search className="size-3.5" />
        <span className="text-xs">Buscar</span>
        <kbd className="ml-1 text-[10px] font-mono bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Botão de busca — só mobile */}
      <button
        className="sm:hidden flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        aria-label="Buscar"
      >
        <Search className="size-5" />
      </button>
    </header>
  );
}
