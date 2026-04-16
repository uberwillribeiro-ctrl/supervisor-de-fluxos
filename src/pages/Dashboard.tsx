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
import { formatDate } from '@/utils/formatDate';

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface MetricCard {
  label: string;
  value: number;
  delta: number; // % vs mês anterior (positivo = alta, negativo = queda)
  icon: React.ElementType;
  color: 'indigo' | 'emerald' | 'amber' | 'red';
}

interface PipelineStage {
  name: string;
  shortName: string;
  value: number;
  fill: string;
}

interface DeadlineRow {
  id: string;
  code: string;
  name: string;
  responsible: string;
  lastReport: string;
  daysIdle: number;
  service: 'PAEFI' | 'SEV';
  urgency: 'critical' | 'warning' | 'ok';
}

interface MonthlyData {
  month: string;
  novos: number;
  arquivados: number;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const METRIC_CARDS: MetricCard[] = [
  { label: 'Casos Novos', value: 7, delta: 16.7, icon: Users, color: 'indigo' },
  { label: 'Casos Ativos', value: 9, delta: 12.5, icon: FolderOpen, color: 'emerald' },
  { label: 'Procedimentos Realizados', value: 38, delta: -5.0, icon: UserCheck, color: 'amber' },
  { label: 'Arquivados', value: 4, delta: 33.3, icon: Archive, color: 'red' },
];

const PIPELINE_STAGES: PipelineStage[] = [
  { name: 'Entrada / Triagem', shortName: 'Triagem', value: 7, fill: '#6366f1' },
  { name: 'Em Atendimento Ativo', shortName: 'Ativos', value: 9, fill: '#818cf8' },
  { name: 'Monitoramento', shortName: 'Monitor.', value: 6, fill: '#a5b4fc' },
  { name: 'Encerramento', shortName: 'Encerr.', value: 4, fill: '#c7d2fe' },
];

const DEADLINE_ROWS: DeadlineRow[] = [
  {
    id: 'case-14',
    code: 'CAS-2025-0112',
    name: 'Francisco Souza Lima',
    responsible: 'Bruno Santos',
    lastReport: '2026-02-10',
    daysIdle: 63,
    service: 'PAEFI',
    urgency: 'critical',
  },
  {
    id: 'case-16',
    code: 'CAS-2026-0020',
    name: 'Antônio Carlos Dias',
    responsible: 'Ana Ferreira',
    lastReport: '2026-03-01',
    daysIdle: 44,
    service: 'PAEFI',
    urgency: 'critical',
  },
  {
    id: 'case-15',
    code: 'CAS-2025-0089',
    name: 'Juliana Cristina Moreira',
    responsible: 'Carla Mendes',
    lastReport: '2026-02-28',
    daysIdle: 45,
    service: 'SEV',
    urgency: 'critical',
  },
  {
    id: 'case-11',
    code: 'CAS-2025-0098',
    name: 'Rosana Maria Cardoso',
    responsible: 'Carla Mendes',
    lastReport: '2026-03-28',
    daysIdle: 18,
    service: 'PAEFI',
    urgency: 'warning',
  },
  {
    id: 'case-12',
    code: 'CAS-2026-0003',
    name: 'Eduardo José Nascimento',
    responsible: 'Ana Ferreira',
    lastReport: '2026-04-02',
    daysIdle: 13,
    service: 'SEV',
    urgency: 'warning',
  },
  {
    id: 'case-09',
    code: 'CAS-2025-0142',
    name: 'Patrícia Gonçalves Silva',
    responsible: 'Diego Lima',
    lastReport: '2026-04-05',
    daysIdle: 10,
    service: 'PAEFI',
    urgency: 'ok',
  },
];

const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Nov', novos: 3, arquivados: 1 },
  { month: 'Dez', novos: 5, arquivados: 2 },
  { month: 'Jan', novos: 4, arquivados: 1 },
  { month: 'Fev', novos: 6, arquivados: 3 },
  { month: 'Mar', novos: 3, arquivados: 2 },
  { month: 'Abr', novos: 7, arquivados: 4 },
];

// ─── Paletas de cor ──────────────────────────────────────────────────────────

const CARD_COLORS = {
  indigo: {
    bg: 'bg-indigo-500/10',
    icon: 'text-indigo-400',
    ring: 'ring-indigo-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    ring: 'ring-amber-500/20',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    ring: 'ring-red-500/20',
  },
};

const URGENCY_CONFIG = {
  critical: {
    dot: 'bg-red-500',
    badge: 'arquivado' as const,
    label: 'Crítico',
  },
  warning: {
    dot: 'bg-amber-400',
    badge: 'novo' as const,
    label: 'Alerta',
  },
  ok: {
    dot: 'bg-slate-500',
    badge: 'neutro' as const,
    label: 'Normal',
  },
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

// Tooltip customizado para o funil
function FunnelTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PipelineStage }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = PIPELINE_STAGES[0].value;
  const pct = ((d.value / total) * 100).toFixed(0);
  return (
    <div className="rounded-xl bg-slate-800 ring-1 ring-slate-700 px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-slate-100">{d.name}</p>
      <p className="text-xs text-slate-400 mt-0.5">
        <span className="text-slate-100 font-bold">{d.value}</span> casos&nbsp;·&nbsp;
        <span className="text-indigo-300">{pct}%</span> do total
      </p>
    </div>
  );
}

// Tooltip customizado para o bar chart
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

  const criticalCount = DEADLINE_ROWS.filter((r) => r.urgency === 'critical').length;

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
        {METRIC_CARDS.map((card) => (
          <MetricCardItem key={card.label} card={card} />
        ))}
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
                  data={PIPELINE_STAGES}
                  isAnimationActive
                  animationDuration={600}
                >
                  {PIPELINE_STAGES.map((stage) => (
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

          {/* Legenda */}
          <div className="mt-4 space-y-1.5">
            {PIPELINE_STAGES.map((stage) => {
              const pct = ((stage.value / PIPELINE_STAGES[0].value) * 100).toFixed(0);
              return (
                <div key={stage.name} className="flex items-center gap-2.5 text-xs">
                  <span
                    className="size-2.5 rounded-sm shrink-0"
                    style={{ background: stage.fill }}
                  />
                  <span className="flex-1 text-slate-400">{stage.name}</span>
                  <span className="font-semibold text-slate-300">{stage.value}</span>
                  <span className="text-slate-600 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
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
                data={MONTHLY_DATA}
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

          {/* Legenda */}
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
            <span>Referência: hoje, 15/04/2026</span>
          </div>
        </div>

        {/* Tabela desktop */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                  Responsável
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                  Último Relatório
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Serviço
                </th>
                <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Dias sem atualização
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DEADLINE_ROWS.map((row) => {
                const urgency = URGENCY_CONFIG[row.urgency];
                return (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors duration-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn('size-2 rounded-full shrink-0', urgency.dot)} />
                        <Badge variant={urgency.badge}>{urgency.label}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-400">{row.code}</td>
                    <td className="px-4 py-4 font-medium text-slate-200">{row.name}</td>
                    <td className="px-4 py-4 text-slate-400 hidden md:table-cell">
                      {row.responsible}
                    </td>
                    <td className="px-4 py-4 text-slate-400 hidden lg:table-cell">
                      {formatDate(row.lastReport)}
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
                        {row.daysIdle}d
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tabela */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            Casos marcados como <span className="text-red-400 font-medium">Crítico</span> têm mais
            de 30 dias sem relatório registrado.
          </p>
          <span className="text-xs text-slate-600">{DEADLINE_ROWS.length} casos exibidos</span>
        </div>
      </div>
    </div>
  );
}
