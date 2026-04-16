import { useState, useMemo } from 'react';
import { FileBarChart2, Eye, Printer, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useCases } from '@/hooks/useCases';
import { useProcedures } from '@/hooks/useProcedures';
import { aggregateRMAFromDb, RMAColumn } from '@/utils/rmaMapping';
import { generateRMAPDF } from '@/lib/pdf';
import { type DbCase } from '@/lib/supabase';
import { type DbProcedure } from '@/lib/supabase';

// ─── Constantes ──────────────────────────────────────────────────────────────

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const RMA_COLUNAS: { key: RMAColumn; label: string }[] = [
  { key: RMAColumn.CONTATOS_EXITO, label: 'Contatos c/ êxito' },
  { key: RMAColumn.TELEFONICAS_SEM_EXITO, label: 'Tel. s/ êxito' },
  { key: RMAColumn.ATEND_INDIVIDUALIZADO, label: 'Atend. Individual.' },
  { key: RMAColumn.ATEND_GRUPO, label: 'Atend. Grupo' },
  { key: RMAColumn.ENCAMINHAMENTO_CRAS, label: 'Enc. CRAS' },
  { key: RMAColumn.VISITAS_DOMICILIAR, label: 'Vis. Domiciliar' },
  { key: RMAColumn.VISITAS_INSTITUCIONAL, label: 'Vis. Institucional' },
  { key: RMAColumn.VISITAS_SEM_EXITO, label: 'Vis. s/ êxito' },
  { key: RMAColumn.CASOS_DESLIGADOS, label: 'Casos Deslig.' },
  { key: RMAColumn.OUTROS_ENCAMINHAMENTOS, label: 'Outros Enc.' },
  { key: RMAColumn.REUNIAO_FAMILIAR, label: 'Reun. Familiar' },
  { key: RMAColumn.PALESTRAS, label: 'Palestras' },
  { key: RMAColumn.PRONTUARIO_SUAS, label: 'Pront. SUAS' },
  { key: RMAColumn.RELATORIOS, label: 'Relatórios' },
  { key: RMAColumn.PIAS, label: "PIA's" },
  { key: RMAColumn.PARECER, label: 'Parecer' },
  { key: RMAColumn.ATENDIDOS_0_10, label: 'Atendidos 0-10' },
  { key: RMAColumn.ATENDIMENTOS_0_10, label: 'Atendim. 0-10' },
  { key: RMAColumn.ATENDIDOS_11_17, label: 'Atendidos 11-17' },
  { key: RMAColumn.ATENDIMENTOS_11_17, label: 'Atendim. 11-17' },
  { key: RMAColumn.MULHERES_VIOLENCIA, label: 'Mulh. c/ Violência' },
  { key: RMAColumn.OUTROS, label: 'Outros' },
];

type TabId = 'rma' | 'observatorio' | 'mascara';

// ─── Aba RMA ─────────────────────────────────────────────────────────────────

function AbaRMA({
  mes,
  ano,
  servico,
  procedimentos,
}: {
  mes: string;
  ano: string;
  servico: string;
  procedimentos: DbProcedure[];
}) {
  // Agrupa por responsável (usando campo category como responsável — ajuste conforme schema real)
  const porResponsavel = useMemo(() => {
    const map: Record<string, typeof procedimentos> = {};
    for (const p of procedimentos) {
      const key = p.category || 'Não informado';
      if (!map[key]) map[key] = [];
      map[key].push(p);
    }
    return map;
  }, [procedimentos]);

  const totalGeral = useMemo(() => aggregateRMAFromDb(procedimentos), [procedimentos]);

  function handleExportPDF() {
    generateRMAPDF({ procedures: [] as never[], month: mes, year: ano, service: servico });
  }

  if (procedimentos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
        <FileBarChart2 className="size-10 text-slate-700" strokeWidth={1.5} />
        <p className="text-sm">
          Nenhum procedimento para {mes}/{ano}
          {servico !== 'ALL' ? ` — ${servico}` : ''}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={handleExportPDF}>
          <Download className="size-3.5 mr-1.5" />
          Exportar PDF
        </Button>
      </div>

      <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500 min-w-36">
                  Técnico
                </th>
                {RMA_COLUNAS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(porResponsavel).map(([responsavel, procs]) => {
                const totals = aggregateRMAFromDb(procs);
                return (
                  <tr key={responsavel} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-3 font-medium text-slate-200">{responsavel}</td>
                    {RMA_COLUNAS.map((col) => {
                      const v = totals[col.key] ?? 0;
                      return (
                        <td key={col.key} className="px-3 py-3 text-center">
                          {v > 0 ? (
                            <span className="font-semibold text-slate-200">{v}</span>
                          ) : (
                            <span className="text-slate-700">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-slate-700 bg-slate-800/60">
                <td className="px-3 py-3 font-bold text-indigo-300 uppercase tracking-wide text-xs">
                  Total Geral
                </td>
                {RMA_COLUNAS.map((col) => {
                  const v = totalGeral[col.key] ?? 0;
                  return (
                    <td key={col.key} className="px-3 py-3 text-center font-bold text-slate-200">
                      {v > 0 ? v : <span className="text-slate-600">0</span>}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Aba Observatório ─────────────────────────────────────────────────────────

function AbaObservatorio({ mes, ano, cases }: { mes: string; ano: string; cases: DbCase[] }) {
  const mesIndex = MESES.indexOf(mes); // 0-based
  const anoNum = parseInt(ano, 10);

  const entradas = useMemo(
    () =>
      cases.filter((c) => {
        if (!c.created_at) return false;
        const d = new Date(c.created_at);
        return d.getMonth() === mesIndex && d.getFullYear() === anoNum;
      }),
    [cases, mesIndex, anoNum],
  );

  const saidas = useMemo(
    () =>
      cases.filter((c) => {
        if (!c.archived_year) return false;
        return c.archived_year === anoNum;
      }),
    [cases, anoNum],
  );

  const ativos = cases.filter((c) => c.status === 'active').length;
  const resolutividade =
    saidas.length > 0 && entradas.length > 0
      ? Math.round((saidas.length / (entradas.length + ativos)) * 100)
      : 0;

  // Breakdown por bairro (ativos)
  const porBairro = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of cases.filter((c) => c.status === 'active')) {
      const b = c.neighborhood ?? 'Não informado';
      map[b] = (map[b] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [cases]);

  // Breakdown por tipo de violência (todos os casos)
  const porMotivo = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of cases) {
      const label = c.violence_type ?? 'Não informado';
      map[label] = (map[label] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [cases]);

  const cards = [
    {
      label: 'Casos Ativos',
      value: ativos,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 ring-indigo-500/20',
    },
    {
      label: 'Entradas no Mês',
      value: entradas.length,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 ring-emerald-500/20',
    },
    {
      label: 'Saídas no Mês',
      value: saidas.length,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 ring-amber-500/20',
    },
    {
      label: 'Resolutividade',
      value: `${resolutividade}%`,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 ring-violet-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={cn('rounded-2xl p-4 ring-1 space-y-1', c.bg)}>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{c.label}</p>
            <p className={cn('text-3xl font-bold', c.color)}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Breakdown por bairro */}
        <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Casos Ativos por Bairro
            </p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-2 text-left text-slate-500 font-semibold uppercase tracking-wider">
                  Bairro
                </th>
                <th className="px-4 py-2 text-right text-slate-500 font-semibold uppercase tracking-wider">
                  Casos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {porBairro.map(([bairro, count]) => (
                <tr key={bairro} className="hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 text-slate-300">{bairro}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-200">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Breakdown por motivo */}
        <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Casos por Tipo de Violência
            </p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-2 text-left text-slate-500 font-semibold uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-4 py-2 text-right text-slate-500 font-semibold uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {porMotivo.map(([motivo, count]) => (
                <tr key={motivo} className="hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 text-slate-300 capitalize">{motivo}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-200">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Aba Máscara ─────────────────────────────────────────────────────────────

function AbaMascara({
  mes,
  ano,
  servico,
  procedimentos,
}: {
  mes: string;
  ano: string;
  servico: string;
  procedimentos: DbProcedure[];
}) {
  const totalGeral = useMemo(() => aggregateRMAFromDb(procedimentos), [procedimentos]);

  const porResponsavel = useMemo(() => {
    const map: Record<string, typeof procedimentos> = {};
    for (const p of procedimentos) {
      const key = p.category || 'Não informado';
      if (!map[key]) map[key] = [];
      map[key].push(p);
    }
    return map;
  }, [procedimentos]);

  const serviceLabel = servico === 'ALL' ? 'PAEFI + SEV' : servico;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Printer className="size-3.5 mr-1.5" />
          Imprimir
        </Button>
      </div>

      {/* Área de impressão */}
      <div
        id="mascara-print"
        className="rounded-2xl bg-white text-slate-900 p-8 space-y-6 ring-1 ring-slate-200 print:ring-0 print:p-0"
      >
        {/* Cabeçalho */}
        <div className="border-b border-slate-200 pb-4 space-y-1">
          <h1 className="text-lg font-bold">CREAS Centro</h1>
          <p className="text-sm text-slate-600">Relatório Mensal de Atendimentos (RMA)</p>
          <div className="flex gap-6 text-sm text-slate-600 mt-1">
            <span>
              <strong>Serviço:</strong> {serviceLabel}
            </span>
            <span>
              <strong>Referência:</strong> {mes}/{ano}
            </span>
            <span>
              <strong>Gerado em:</strong> {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Tabela RMA */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-2 text-left font-semibold">
                  Técnico
                </th>
                {RMA_COLUNAS.map((col) => (
                  <th
                    key={col.key}
                    className="border border-slate-300 px-2 py-2 text-center font-semibold text-[10px]"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(porResponsavel).map(([responsavel, procs]) => {
                const totals = aggregateRMAFromDb(procs);
                return (
                  <tr key={responsavel}>
                    <td className="border border-slate-300 px-2 py-1.5 font-medium">
                      {responsavel}
                    </td>
                    {RMA_COLUNAS.map((col) => {
                      const v = totals[col.key] ?? 0;
                      return (
                        <td
                          key={col.key}
                          className="border border-slate-300 px-2 py-1.5 text-center"
                        >
                          {v > 0 ? v : <span className="text-slate-300">0</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td className="border border-slate-300 px-2 py-2">TOTAL GERAL</td>
                {RMA_COLUNAS.map((col) => (
                  <td key={col.key} className="border border-slate-300 px-2 py-2 text-center">
                    {totalGeral[col.key] ?? 0}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Rodapé de assinatura */}
        <div className="grid grid-cols-2 gap-16 pt-8 mt-4 border-t border-slate-200">
          <div className="space-y-1 text-center">
            <div className="border-t border-slate-400 pt-2">
              <p className="text-xs text-slate-600">Técnico Responsável</p>
            </div>
          </div>
          <div className="space-y-1 text-center">
            <div className="border-t border-slate-400 pt-2">
              <p className="text-xs text-slate-600">Coordenador(a) da Unidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: typeof Eye }[] = [
  { id: 'rma', label: 'RMA', icon: FileBarChart2 },
  { id: 'observatorio', label: 'Observatório', icon: Eye },
  { id: 'mascara', label: 'Máscara', icon: Printer },
];

export default function Relatorios() {
  const [tab, setTab] = useState<TabId>('rma');
  const [mes, setMes] = useState('Abril');
  const [ano, setAno] = useState('2026');
  const [servico, setServico] = useState('ALL');

  const { procedures: allProcedimentos } = useProcedures(
    mes,
    ano,
    servico === 'ALL' ? undefined : servico,
  );
  const { cases: allCases } = useCases();

  return (
    <div className="space-y-4">
      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Relatórios</h2>
          <p className="text-xs text-slate-500 mt-0.5">RMA, Observatório e Máscara de impressão</p>
        </div>

        {/* Filtros globais */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            label=""
            options={MESES.map((m) => ({ value: m, label: m }))}
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          />
          <input
            type="text"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className={cn(
              'h-9 px-3 text-sm rounded-xl w-20',
              'bg-slate-800 text-slate-200',
              'ring-1 ring-slate-700 focus:ring-indigo-500 outline-none transition-shadow',
            )}
          />
          <Select
            label=""
            options={[
              { value: 'ALL', label: 'Todos os serviços' },
              { value: 'PAEFI', label: 'PAEFI' },
              { value: 'SEV', label: 'SEV' },
            ]}
            value={servico}
            onChange={(e) => setServico(e.target.value)}
          />
        </div>
      </div>

      {/* ── Abas ── */}
      <div className="flex gap-1 border-b border-slate-800 pb-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors',
                active
                  ? 'bg-slate-900 text-slate-100 ring-1 ring-slate-800 ring-b-0 -mb-px pb-3'
                  : 'text-slate-500 hover:text-slate-300',
              )}
            >
              <Icon className="size-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Conteúdo da aba ── */}
      <div>
        {tab === 'rma' && (
          <AbaRMA mes={mes} ano={ano} servico={servico} procedimentos={allProcedimentos} />
        )}
        {tab === 'observatorio' && <AbaObservatorio mes={mes} ano={ano} cases={allCases} />}
        {tab === 'mascara' && (
          <AbaMascara mes={mes} ano={ano} servico={servico} procedimentos={allProcedimentos} />
        )}
      </div>
    </div>
  );
}
