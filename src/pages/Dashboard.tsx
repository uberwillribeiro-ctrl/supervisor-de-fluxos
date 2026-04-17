import { useMemo } from 'react';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Users,
  FolderOpen,
  UserCheck,
  Archive,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useCases } from '@/hooks/useCases';
import { useProcedures } from '@/hooks/useProcedures';
import { formatDate } from '@/utils/formatDate';

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface MetricCard {
  label: string;
  value: number;
  delta: number;
  icon: React.ElementType;
  color: 'indigo' | 'emerald' | 'amber' | 'red';
}

interface PipelineStage {
  name: string;
  shortName: string;
  value: number;
  fill: string;
}

interface MonthlyData {
  month: string;
  novos: number;
  arquivados: number;
}

// ─── Paletas de cor ──────────────────────────────────────────────────────────

const CARD_COLORS = {
  indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-400', ring: 'ring-indigo-500/20' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', ring: 'ring-amber-500/20' },
  red: { bg: 'bg-red-500/10', icon: 'text-red-400', ring: 'ring-red-500/20' },
};

const URGENCY_CONFIG = {
  critical: { dot: 'bg-red-500', badge: 'arquivado' as const, label: 'Crítico' },
  warning: { dot: 'bg-amber-400', badge: 'novo' as const, label: 'Alerta' },
  ok: { dot: 'bg-slate-500', badge: 'neutro' as const, label: 'Normal' },
};

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function DeltaIndicator({ delta }: { delta: number }) {
  if (Math.abs(delta) < 0.5) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-slate-500">
        <Minus className="size-3" />
        Estável
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-emerald-400">
        <TrendingUp className="size-3" />+{delta.toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-xs text-red-400">
      <TrendingDown className="size-3" />
      {delta.toFixed(1)}%
    </span>
  );
}

function MetricCardItem({ card }: { card: MetricCard }) {
  const Icon = card.icon;
  const colors = CARD_COLORS[card.color];
  return (
    <div
      className={cn('rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-5', 'flex flex-col gap-4')}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex items-center justify-center size-10 rounded-xl ring-1',
            colors.bg,
            colors.ring,
          )}
        >
          <Icon className={cn('size-5', colors.icon)} strokeWidth={2} />
        </div>
        <DeltaIndicator delta={card.delta} />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-100 tabular-nums">{card.value}</p>
        <p className="mt-1 text-sm text-slate-500">{card.label}</p>
      </div>
    </div>
  );
}

function FunnelTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PipelineStage }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = d.value;
  return (
    <div className="rounded-xl bg-slate-800 ring-1 ring-slate-700 px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-slate-100">{d.name}</p>
      <p className="text-xs text-slate-400 mt-0.5">
        <span className="text-slate-100 font-bold">{total}</span> casos
      </p>
    </div>
  );
}

function BarTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-slate-800 ring-1 ring-slate-700 px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name === 'novos' ? 'Novos' : 'Arquivados'}:</span>
          <span className="font-bold text-slate-100">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Usuário';

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // ── Dados reais ──────────────────────────────────────────────────────────────
  const { cases: novos, loading: loadingNovos } = useCases({ status: 'new' });
  const { cases: ativos, loading: loadingAtivos } = useCases({ status: 'active' });
  const { cases: arquivados, loading: loadingArquivados } = useCases({ status: 'archived' });
  const { procedures, loading: loadingProc } = useProcedures();

  const loading = loadingNovos || loadingAtivos || loadingArquivados || loadingProc;

  // ── Cards de métricas ────────────────────────────────────────────────────────
  const metricCards: MetricCard[] = useMemo(
    () => [
      { label: 'Casos Novos', value: novos.length, delta: 0, icon: Users, color: 'indigo' },
      { label: 'Casos Ativos', value: ativos.length, delta: 0, icon: FolderOpen, color: 'emerald' },
      {
        label: 'Procedimentos Realizados',
        value: procedures.length,
        delta: 0,
        icon: UserCheck,
        color: 'amber',
      },
      { label: 'Arquivados', value: arquivados.length, delta: 0, icon: Archive, color: 'red' },
    ],
    [novos.length, ativos.length, procedures.length, arquivados.length],
  );

  // ── Funil do pipeline ────────────────────────────────────────────────────────
  const pipelineStages: PipelineStage[] = useMemo(
    () =>
      [
        { name: 'Entrada / Triagem', shortName: 'Triagem', value: novos.length, fill: '#6366f1' },
        {
          name: 'Em Atendimento Ativo',
          shortName: 'Ativos',
          value: ativos.length,
          fill: '#818cf8',
        },
        { name: 'Encerramento', shortName: 'Encerr.', value: arquivados.length, fill: '#c7d2fe' },
      ].filter((s) => s.value > 0),
    [novos.length, ativos.length, arquivados.length],
  );

  // ── Casos próximos do prazo (sem relatório há mais dias) ─────────────────────
  const todayMs = new Date().setHours(0, 0, 0, 0);
  const deadlineRows = useMemo(() => {
    return ativos
      .map((c) => {
        const daysIdle = c.ultimo_relatorio
          ? Math.floor((todayMs - new Date(c.ultimo_relatorio).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        return {
          id: c.id,
          code: c.code ?? '—',
          name: c.name,
          responsible: c.responsible ?? '—',
          lastReport: c.ultimo_relatorio ?? null,
          daysIdle,
          service: (c.profile ?? 'PAEFI') as 'PAEFI' | 'SEV',
          urgency:
            daysIdle > 30
              ? ('critical' as const)
              : daysIdle > 15
                ? ('warning' as const)
                : ('ok' as const),
        };
      })
      .sort((a, b) => b.daysIdle - a.daysIdle)
      .slice(0, 10);
  }, [ativos, todayMs]);

  const criticalCount = deadlineRows.filter((r) => r.urgency === 'critical').length;

  // ── Dados mensais (últimos 6 meses a partir dos casos reais) ─────────────────
  const monthlyData: MonthlyData[] = useMemo(() => {
    const MONTH_LABELS = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const now = new Date();
    const result: MonthlyData[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();

      const novosCount = novos.filter((c) => {
        if (!c.created_at) return false;
        const cd = new Date(c.created_at);
        return cd.getMonth() === m && cd.getFullYear() === y;
      }).length;

      const arquivadosCount = arquivados.filter((c) => c.archived_year === y).length;

      result.push({
        month: MONTH_LABELS[m],
        novos: novosCount,
        arquivados: Math.round(arquivadosCount / 6),
      });
    }
    return result;
  }, [novos, arquivados]);

  return (
    <div className="space-y-8">
      {/* ── Cabeçalho de boas-vindas ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Olá, {firstName} 👋</h2>
          <p className="text-sm text-slate-500 capitalize mt-0.5">{today}</p>
        </div>

        {criticalCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-2.5">
            <AlertTriangle className="size-4 text-red-400 shrink-0" />
            <span className="text-sm text-red-300">
              <span className="font-bold">{criticalCount}</span>{' '}
              {criticalCount === 1 ? 'caso crítico' : 'casos críticos'} sem atualização
            </span>
          </div>
        )}
      </div>

      {/* ── 4 Cards de métricas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-5 h-28 animate-pulse"
              />
            ))
          : metricCards.map((card) => <MetricCardItem key={card.label} card={card} />)}
      </div>

      {/* ── Gráficos: funil + barras ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funil do pipeline */}
        <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-200">Funil do Pipeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribuição de casos por etapa</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<FunnelTooltipContent />} />
                <Funnel
                  dataKey="value"
                  data={pipelineStages}
                  isAnimationActive
                  animationDuration={600}
                >
                  {pipelineStages.map((stage) => (
                    <Cell key={stage.name} fill={stage.fill} />
                  ))}
                  <LabelList
                    position="right"
                    fill="#94a3b8"
                    stroke="none"
                    dataKey="shortName"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  />
                  <LabelList
                    position="center"
                    fill="#f1f5f9"
                    stroke="none"
                    dataKey="value"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-1.5">
            {pipelineStages.map((stage) => (
              <div key={stage.name} className="flex items-center gap-2.5 text-xs">
                <span className="size-2.5 rounded-sm shrink-0" style={{ background: stage.fill }} />
                <span className="flex-1 text-slate-400">{stage.name}</span>
                <span className="font-semibold text-slate-300">{stage.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Barras: novos vs arquivados por mês */}
        <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-200">Casos por Mês</h3>
            <p className="text-xs text-slate-500 mt-0.5">Últimos 6 meses — Entradas vs Saídas</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                barGap={3}
                barCategoryGap="28%"
                margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<BarTooltipContent />} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="novos" name="novos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="arquivados" name="arquivados" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="size-2.5 rounded-sm bg-indigo-500 shrink-0" />
              Novos casos
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="size-2.5 rounded-sm bg-slate-700 shrink-0" />
              Arquivados
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabela: casos próximos do prazo ── */}
      <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Casos — Prazo de Atualização</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Casos ativos ordenados por tempo desde o último relatório
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="size-3.5" />
            <span>Referência: hoje</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  'Status',
                  'Código',
                  'Nome',
                  'Responsável',
                  'Último Relatório',
                  'Serviço',
                  'Dias sem atualização',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    Carregando...
                  </td>
                </tr>
              ) : deadlineRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    Nenhum caso ativo encontrado.
                  </td>
                </tr>
              ) : (
                deadlineRows.map((row) => {
                  const urgency = URGENCY_CONFIG[row.urgency];
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-800/40 transition-colors duration-100"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('size-2 rounded-full shrink-0', urgency.dot)} />
                          <Badge variant={urgency.badge}>{urgency.label}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-400">{row.code}</td>
                      <td className="px-4 py-4 font-medium text-slate-200">{row.name}</td>
                      <td className="px-4 py-4 text-slate-400">{row.responsible}</td>
                      <td className="px-4 py-4 text-slate-400">
                        {row.lastReport ? (
                          formatDate(row.lastReport)
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded-md',
                            row.service === 'PAEFI'
                              ? 'bg-indigo-500/10 text-indigo-300'
                              : 'bg-emerald-500/10 text-emerald-300',
                          )}
                        >
                          {row.service}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            row.urgency === 'critical' && 'text-red-400',
                            row.urgency === 'warning' && 'text-amber-400',
                            row.urgency === 'ok' && 'text-slate-400',
                          )}
                        >
                          {row.daysIdle === 999 ? '—' : `${row.daysIdle}d`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            Casos marcados como <span className="text-red-400 font-medium">Crítico</span> têm mais
            de 30 dias sem relatório.
          </p>
          <span className="text-xs text-slate-600">{deadlineRows.length} casos exibidos</span>
        </div>
      </div>
    </div>
  );
}
