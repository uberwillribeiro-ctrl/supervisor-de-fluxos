import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

// ─── Contexto ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const baseId = useId();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 4000) => {
      const id = `${baseId}-${Date.now()}`;
      setToasts((prev) => [...prev.slice(-4), { id, variant, message, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [baseId, dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (msg) => toast(msg, 'success'),
      error: (msg) => toast(msg, 'error'),
      info: (msg) => toast(msg, 'info'),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notificações"
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-xs"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ─── Item individual ─────────────────────────────────────────────────────────

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle; classes: string }> = {
  success: {
    icon: CheckCircle,
    classes: 'bg-emerald-500/15 ring-emerald-500/30 text-emerald-400',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-500/15 ring-red-500/30 text-red-400',
  },
  info: {
    icon: Info,
    classes: 'bg-indigo-500/15 ring-indigo-500/30 text-indigo-400',
  },
};

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { icon: Icon, classes } = variantConfig[item.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex items-start gap-3 rounded-xl px-4 py-3',
        'bg-slate-900 ring-1 shadow-xl',
        classes,
      )}
      role="alert"
    >
      <Icon className="size-4 mt-0.5 shrink-0" strokeWidth={2} />
      <p className="flex-1 text-sm text-slate-200 leading-snug">{item.message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}
