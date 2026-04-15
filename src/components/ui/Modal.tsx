import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils/cn';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, size = 'md', children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fechar com Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Trap de foco
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Container + Painel (motion no container garante exit animation) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="modal-container"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={cn(
                'pointer-events-auto relative w-full rounded-2xl bg-slate-900 ring-1 ring-slate-700 shadow-2xl',
                'flex flex-col max-h-[90vh]',
                sizeClasses[size],
                className,
              )}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                  <h2 className="text-base font-semibold text-slate-100">{title}</h2>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center size-7 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                    aria-label="Fechar modal"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              {/* Conteúdo */}
              <div className="overflow-y-auto flex-1 p-5">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
