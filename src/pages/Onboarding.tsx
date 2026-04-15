import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/ui/LogoMark';
import { cn } from '@/utils/cn';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StepId = 0 | 1;

const WORKSPACE_KEY = 'sf_workspace';

// ─── Variantes de animação ────────────────────────────────────────────────────

const stepVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  const [step, setStep] = useState<StepId>(0);
  const [workspace, setWorkspace] = useState('');
  const [workspaceError, setWorkspaceError] = useState<string | undefined>();
  const [workspaceTouched, setWorkspaceTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateWorkspace(value: string): string | undefined {
    if (!value.trim()) return 'Nome do workspace é obrigatório';
    if (value.trim().length < 3) return 'Mínimo de 3 caracteres';
    if (value.trim().length > 60) return 'Máximo de 60 caracteres';
    return undefined;
  }

  function handleWorkspaceChange(e: ChangeEvent<HTMLInputElement>) {
    setWorkspace(e.target.value);
    if (workspaceTouched) {
      setWorkspaceError(validateWorkspace(e.target.value));
    }
  }

  function handleWorkspaceBlur() {
    setWorkspaceTouched(true);
    setWorkspaceError(validateWorkspace(workspace));
  }

  async function handleComplete(e: FormEvent) {
    e.preventDefault();
    setWorkspaceTouched(true);
    const error = validateWorkspace(workspace);
    setWorkspaceError(error);
    if (error) return;

    setIsSubmitting(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    const trimmed = workspace.trim();
    localStorage.setItem(WORKSPACE_KEY, trimmed);
    updateProfile({ unit: trimmed });
    navigate('/app');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      {/* Indicador de progresso */}
      <div className="flex items-center gap-2 mb-10">
        {([0, 1] as StepId[]).map((s) => (
          <div
            key={s}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              s === step
                ? 'w-8 bg-indigo-500'
                : s < step
                  ? 'w-4 bg-indigo-700'
                  : 'w-4 bg-slate-700',
            )}
          />
        ))}
      </div>

      {/* Conteúdo animado do step */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div
              key="step-welcome"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-6"
            >
              {/* Ícone */}
              <div className="flex justify-center">
                <div className="relative">
                  <LogoMark size="lg" />
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950">
                    <Sparkles className="size-3 text-white" strokeWidth={2.5} />
                  </span>
                </div>
              </div>

              {/* Texto */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-100">
                  Bem-vindo ao Supervisor de Fluxos
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Organize casos, registre procedimentos e gere relatórios RMA — tudo em um só
                  lugar. Vamos configurar seu workspace em menos de um minuto.
                </p>
              </div>

              {/* CTA */}
              <Button variant="primary" size="lg" onClick={() => setStep(1)} className="mx-auto">
                Vamos começar
                <ArrowRight className="size-4" />
              </Button>

              <p className="text-xs text-slate-600">Passo 1 de 2</p>
            </motion.div>
          ) : (
            <motion.div
              key="step-workspace"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Card */}
              <div className="bg-slate-900 ring-1 ring-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center size-10 rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/30">
                    <Building2 className="size-5 text-indigo-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-100">Seu workspace</h2>
                    <p className="text-xs text-slate-500">Como se chama sua unidade ou equipe?</p>
                  </div>
                </div>

                <form onSubmit={handleComplete} noValidate className="space-y-5">
                  <Input
                    label="Nome do workspace"
                    type="text"
                    placeholder="ex: CREAS Centro, Equipe PAEFI..."
                    autoComplete="organization"
                    autoFocus
                    value={workspace}
                    onChange={handleWorkspaceChange}
                    onBlur={handleWorkspaceBlur}
                    error={workspaceTouched ? workspaceError : undefined}
                    hint="Este nome aparecerá nos relatórios e PDFs gerados"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                    className="w-full"
                  >
                    {!isSubmitting && <Sparkles className="size-4" />}
                    Concluir configuração
                  </Button>
                </form>
              </div>

              <p className="text-center text-xs text-slate-600 mt-4">Passo 2 de 2</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
