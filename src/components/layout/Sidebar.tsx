import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ClipboardList,
  Archive,
  FileBarChart2,
  ChevronDown,
  Check,
  Building2,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { type UserProfile, UserRole } from '@/types/user';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type PageId =
  | 'dashboard'
  | 'casos-novos'
  | 'casos-ativos'
  | 'procedimentos'
  | 'arquivados'
  | 'relatorios';

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

interface Workspace {
  id: string;
  name: string;
  unit: string;
}

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Dados fake ──────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'casos-novos', label: 'Casos Novos', icon: UserPlus },
  { id: 'casos-ativos', label: 'Casos Ativos', icon: Users },
  { id: 'procedimentos', label: 'Procedimentos', icon: ClipboardList },
  { id: 'arquivados', label: 'Arquivados', icon: Archive },
  { id: 'relatorios', label: 'Relatórios', icon: FileBarChart2 },
];

const FAKE_WORKSPACES: Workspace[] = [
  { id: '1', name: 'CREAS Centro', unit: 'Unidade Centro' },
  { id: '2', name: 'CREAS Norte', unit: 'Unidade Norte' },
  { id: '3', name: 'CREAS Sul', unit: 'Unidade Sul' },
];

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function WorkspaceSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(FAKE_WORKSPACES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative px-3 pb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5',
          'bg-slate-800 hover:bg-slate-700 transition-colors duration-150',
          'ring-1 ring-slate-700',
          open && 'ring-indigo-500/50',
        )}
      >
        <div className="flex items-center justify-center size-7 rounded-lg bg-indigo-600 shrink-0">
          <Building2 className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 text-left overflow-hidden">
          <p className="text-sm font-semibold text-slate-100 truncate">{selected.name}</p>
          <p className="text-xs text-slate-500 truncate">{selected.unit}</p>
        </div>
        <ChevronDown
          className={cn(
            'size-4 text-slate-500 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-3 right-3 top-full mt-1 z-10 rounded-xl bg-slate-800 ring-1 ring-slate-700 shadow-2xl overflow-hidden"
          >
            {FAKE_WORKSPACES.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setSelected(ws);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left',
                  'hover:bg-slate-700 transition-colors duration-100',
                  selected.id === ws.id && 'bg-slate-700/50',
                )}
              >
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-slate-200 truncate">{ws.name}</p>
                  <p className="text-xs text-slate-500 truncate">{ws.unit}</p>
                </div>
                {selected.id === ws.id && (
                  <Check className="size-4 text-indigo-400 shrink-0" strokeWidth={2} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
        'transition-colors duration-150',
        active
          ? 'bg-indigo-600 text-white'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
      {item.label}
    </button>
  );
}

function UserFooter({ user }: { user: UserProfile }) {
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="border-t border-slate-800 px-3 py-3">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        <div className="flex items-center justify-center size-8 rounded-full bg-indigo-600 text-white text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        <button
          className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
          aria-label="Sair"
          title="Sair"
        >
          <LogOut className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ─── Conteúdo da Sidebar ─────────────────────────────────────────────────────

function SidebarContent({
  activePage,
  onNavigate,
  currentUser,
  onClose,
}: Omit<SidebarProps, 'isOpen'>) {
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(currentUser.role),
  );

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800">
        <div className="flex items-center justify-center size-8 rounded-xl bg-indigo-600">
          <svg viewBox="0 0 24 24" className="size-4 text-white" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className="text-base font-bold text-slate-100 tracking-tight">PipeFlow</span>
      </div>

      {/* Workspace selector */}
      <div className="pt-3">
        <WorkspaceSelector />
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {visibleItems.map((item) => (
          <NavLink
            key={item.id}
            item={item}
            active={activePage === item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose();
            }}
          />
        ))}
      </nav>

      {/* User footer */}
      <UserFooter user={currentUser} />
    </div>
  );
}

// ─── Sidebar principal ───────────────────────────────────────────────────────

export function Sidebar({ activePage, onNavigate, currentUser, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop — sidebar fixa */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 h-screen sticky top-0 border-r border-slate-800">
        <div className="flex-1 overflow-hidden">
          <SidebarContent
            activePage={activePage}
            onNavigate={onNavigate}
            currentUser={currentUser}
            onClose={() => {}}
          />
        </div>
      </aside>

      {/* Mobile — drawer com overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="sidebar-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-40 w-72 md:hidden border-r border-slate-800"
          >
            <SidebarContent
              activePage={activePage}
              onNavigate={onNavigate}
              currentUser={currentUser}
              onClose={onClose}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// Re-exporta o tipo das páginas
export type { NavItem };
export { NAV_ITEMS };

// Helper para label da página ativa
export function getPageLabel(page: PageId): string {
  return NAV_ITEMS.find((i) => i.id === page)?.label ?? page;
}
