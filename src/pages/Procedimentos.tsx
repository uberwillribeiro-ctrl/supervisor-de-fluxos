import { useState } from 'react';
import { Plus, Search, ClipboardList, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { MOCK_TECHNICIANS } from '@/lib/mockData';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ProcedimentoMock {
  id: string;
  nome: string;
  data: string;
  ano: number;
  mes: string;
  servico: 'PAEFI' | 'SEV';
  responsavel: string;
  // atendimentos individuais
  atIndFamilia: number;
  atIndCrianca: number;
  atIndAdolescente: number;
  atIndAdulto: number;
  atIndIdoso: number;
  // atendimentos coletivos
  atColFamilia: number;
  atColCrianca: number;
  atColAdolescente: number;
  atColAdulto: number;
  atColIdoso: number;
  // visitas
  visitasDomiciliares: number;
  encaminhamentos: number;
  reunioes: number;
  total: number;
}

interface ProcedimentoForm {
  casoVinculado: string;
  data: string;
  tipoProcedimento: string;
  responsavel: string;
  criancas: string;
  adolescentes: string;
  adultos: string;
  idosos: string;
  observacoes: string;
}

const FORM_EMPTY: ProcedimentoForm = {
  casoVinculado: '',
  data: '',
  tipoProcedimento: '',
  responsavel: '',
  criancas: '',
  adolescentes: '',
  adultos: '',
  idosos: '',
  observacoes: '',
};

const TIPOS_PROCEDIMENTO = [
  'Atendimento Individual',
  'Atendimento Coletivo',
  'Visita Domiciliar',
  'Encaminhamento',
  'Reunião de Equipe',
  'Atividade Socioeducativa',
];

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

// ─── Mock data de procedimentos ──────────────────────────────────────────────

const MOCK_PROCEDIMENTOS: ProcedimentoMock[] = [
  {
    id: 'proc-01',
    nome: 'Roberto Carlos Alves',
    data: '2026-04-10',
    ano: 2026,
    mes: 'Abril',
    servico: 'PAEFI',
    responsavel: 'Ana Ferreira',
    atIndFamilia: 1,
    atIndCrianca: 0,
    atIndAdolescente: 0,
    atIndAdulto: 1,
    atIndIdoso: 0,
    atColFamilia: 0,
    atColCrianca: 0,
    atColAdolescente: 0,
    atColAdulto: 0,
    atColIdoso: 0,
    visitasDomiciliares: 1,
    encaminhamentos: 0,
    reunioes: 0,
    total: 3,
  },
  {
    id: 'proc-02',
    nome: 'Patrícia Gonçalves Silva',
    data: '2026-04-05',
    ano: 2026,
    mes: 'Abril',
    servico: 'PAEFI',
    responsavel: 'Diego Lima',
    atIndFamilia: 1,
    atIndCrianca: 1,
    atIndAdolescente: 0,
    atIndAdulto: 0,
    atIndIdoso: 0,
    atColFamilia: 0,
    atColCrianca: 1,
    atColAdolescente: 0,
    atColAdulto: 0,
    atColIdoso: 0,
    visitasDomiciliares: 0,
    encaminhamentos: 1,
    reunioes: 0,
    total: 4,
  },
  {
    id: 'proc-03',
    nome: 'Marcelo Antônio Pereira',
    data: '2026-04-08',
    ano: 2026,
    mes: 'Abril',
    servico: 'SEV',
    responsavel: 'Bruno Santos',
    atIndFamilia: 0,
    atIndCrianca: 0,
    atIndAdolescente: 0,
    atIndAdulto: 1,
    atIndIdoso: 0,
    atColFamilia: 1,
    atColCrianca: 0,
    atColAdolescente: 0,
    atColAdulto: 1,
    atColIdoso: 0,
    visitasDomiciliares: 1,
    encaminhamentos: 0,
    reunioes: 1,
    total: 5,
  },
  {
    id: 'proc-04',
    nome: 'Rosana Maria Cardoso',
    data: '2026-03-28',
    ano: 2026,
    mes: 'Março',
    servico: 'PAEFI',
    responsavel: 'Carla Mendes',
    atIndFamilia: 1,
    atIndCrianca: 0,
    atIndAdolescente: 1,
    atIndAdulto: 0,
    atIndIdoso: 0,
    atColFamilia: 0,
    atColCrianca: 0,
    atColAdolescente: 1,
    atColAdulto: 0,
    atColIdoso: 0,
    visitasDomiciliares: 0,
    encaminhamentos: 1,
    reunioes: 0,
    total: 4,
  },
  {
    id: 'proc-05',
    nome: 'Eduardo José Nascimento',
    data: '2026-04-02',
    ano: 2026,
    mes: 'Abril',
    servico: 'SEV',
    responsavel: 'Ana Ferreira',
    atIndFamilia: 0,
    atIndCrianca: 0,
    atIndAdolescente: 1,
    atIndAdulto: 0,
    atIndIdoso: 0,
    atColFamilia: 0,
    atColCrianca: 0,
    atColAdolescente: 2,
    atColAdulto: 0,
    atColIdoso: 0,
    visitasDomiciliares: 0,
    encaminhamentos: 0,
    reunioes: 1,
    total: 4,
  },
  {
    id: 'proc-06',
    nome: 'Cristina Paula Barbosa',
    data: '2026-04-11',
    ano: 2026,
    mes: 'Abril',
    servico: 'PAEFI',
    responsavel: 'Diego Lima',
    atIndFamilia: 1,
    atIndCrianca: 0,
    atIndAdolescente: 0,
    atIndAdulto: 1,
    atIndIdoso: 1,
    atColFamilia: 1,
    atColCrianca: 0,
    atColAdolescente: 0,
    atColAdulto: 1,
    atColIdoso: 1,
    visitasDomiciliares: 1,
    encaminhamentos: 1,
    reunioes: 0,
    total: 8,
  },
];

// ─── Colunas da tabela (RMA) ─────────────────────────────────────────────────

const COLUNAS_ATEND = [
  { key: 'atIndFamilia', label: 'At. Ind. Família' },
  { key: 'atIndCrianca', label: 'At. Ind. Criança' },
  { key: 'atIndAdolescente', label: 'At. Ind. Adolesc.' },
  { key: 'atIndAdulto', label: 'At. Ind. Adulto' },
  { key: 'atIndIdoso', label: 'At. Ind. Idoso' },
  { key: 'atColFamilia', label: 'At. Col. Família' },
  { key: 'atColCrianca', label: 'At. Col. Criança' },
  { key: 'atColAdolescente', label: 'At. Col. Adolesc.' },
  { key: 'atColAdulto', label: 'At. Col. Adulto' },
  { key: 'atColIdoso', label: 'At. Col. Idoso' },
  { key: 'visitasDomiciliares', label: 'Visitas Dom.' },
  { key: 'encaminhamentos', label: 'Encaminhamentos' },
  { key: 'reunioes', label: 'Reuniões' },
] as const;

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Procedimentos() {
  const [mesFiltro, setMesFiltro] = useState('Abril');
  const [anoFiltro, setAnoFiltro] = useState('2026');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProcedimentoForm>(FORM_EMPTY);

  const procedimentosFiltrados = MOCK_PROCEDIMENTOS.filter(
    (p) => p.mes === mesFiltro && p.ano.toString() === anoFiltro,
  );

  function setField<K extends keyof ProcedimentoForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSalvar() {
    setModalOpen(false);
    setForm(FORM_EMPTY);
  }

  return (
    <div className="space-y-4">
      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Procedimentos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestão e monitoramento de atendimentos</p>
        </div>
      </div>

      {/* ── Filtros + Ações ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          label=""
          options={MESES.map((m) => ({ value: m, label: m }))}
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
        />
        <input
          type="text"
          value={anoFiltro}
          onChange={(e) => setAnoFiltro(e.target.value)}
          className={cn(
            'h-9 px-3 text-sm rounded-xl w-24',
            'bg-slate-800 text-slate-200',
            'ring-1 ring-slate-700 focus:ring-indigo-500 outline-none transition-shadow',
          )}
        />
        <Button variant="secondary" size="sm">
          <Download className="size-3.5 mr-1.5" />
          Importar RMA
        </Button>
        <div className="flex-1" />
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="size-3.5 mr-1" />
          Adicionar Procedimento
        </Button>
      </div>

      {/* ── Tabela ── */}
      <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">
                  Nome
                </th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">
                  Data
                </th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">
                  Serviço
                </th>
                <th className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500">
                  Responsável
                </th>
                {COLUNAS_ATEND.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-indigo-400">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {procedimentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={18} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <ClipboardList className="size-8 text-slate-700" strokeWidth={1.5} />
                      <p className="text-sm">
                        Nenhum procedimento para {mesFiltro}/{anoFiltro}.
                      </p>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors"
                      >
                        <Plus className="size-3.5" />
                        Adicionar Procedimento
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                procedimentosFiltrados.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-3 text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-3 font-medium text-slate-200">{p.nome}</td>
                    <td className="px-3 py-3 text-slate-400">{p.data}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-md',
                          p.servico === 'PAEFI'
                            ? 'bg-indigo-500/10 text-indigo-300'
                            : 'bg-emerald-500/10 text-emerald-300',
                        )}
                      >
                        {p.servico}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{p.responsavel}</td>
                    {COLUNAS_ATEND.map((col) => (
                      <td key={col.key} className="px-3 py-3 text-center text-slate-400">
                        {p[col.key] > 0 ? (
                          <span className="font-semibold text-slate-200">{p[col.key]}</span>
                        ) : (
                          <span className="text-slate-700">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center font-bold text-indigo-300">{p.total}</td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Totalizador */}
            {procedimentosFiltrados.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-800/50">
                  <td
                    colSpan={5}
                    className="px-3 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide"
                  >
                    Total do Mês
                  </td>
                  {COLUNAS_ATEND.map((col) => {
                    const soma = procedimentosFiltrados.reduce((acc, p) => acc + p[col.key], 0);
                    return (
                      <td key={col.key} className="px-3 py-3 text-center font-bold text-slate-200">
                        {soma > 0 ? soma : <span className="text-slate-600">0</span>}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center font-bold text-indigo-300">
                    {procedimentosFiltrados.reduce((acc, p) => acc + p.total, 0)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Modal: Registrar Procedimento ── */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm(FORM_EMPTY);
        }}
        title="Registrar Procedimento"
        size="lg"
      >
        <div className="space-y-4">
          {/* Puxar por código */}
          <div className="rounded-xl bg-indigo-500/5 ring-1 ring-indigo-500/20 p-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Vincular caso pelo código..."
                value={form.casoVinculado}
                onChange={(e) => setField('casoVinculado', e.target.value)}
                className={cn(
                  'flex-1 h-9 px-3 text-sm rounded-xl',
                  'bg-slate-800 text-slate-200 placeholder:text-slate-500',
                  'ring-1 ring-slate-700 focus:ring-indigo-500 outline-none transition-shadow',
                )}
              />
              <Button variant="primary" size="sm">
                <Search className="size-3.5 mr-1.5" />
                Localizar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Data"
              type="date"
              value={form.data}
              onChange={(e) => setField('data', e.target.value)}
            />
            <Select
              label="Tipo de Procedimento"
              placeholder="Selecione..."
              options={TIPOS_PROCEDIMENTO.map((t) => ({ value: t, label: t }))}
              value={form.tipoProcedimento}
              onChange={(e) => setField('tipoProcedimento', e.target.value)}
            />
            <Select
              label="Responsável"
              placeholder="Selecione..."
              options={MOCK_TECHNICIANS.map((t) => ({ value: t.id, label: t.name }))}
              value={form.responsavel}
              onChange={(e) => setField('responsavel', e.target.value)}
            />
          </div>

          {/* Participantes por faixa etária */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Participantes por Faixa Etária
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Crianças (0–10)"
                value={form.criancas}
                onChange={(e) => setField('criancas', e.target.value)}
              />
              <Input
                label="Adolescentes (11–17)"
                value={form.adolescentes}
                onChange={(e) => setField('adolescentes', e.target.value)}
              />
              <Input
                label="Adultos (18–59)"
                value={form.adultos}
                onChange={(e) => setField('adultos', e.target.value)}
              />
              <Input
                label="Idosos (60+)"
                value={form.idosos}
                onChange={(e) => setField('idosos', e.target.value)}
              />
            </div>
          </div>

          {/* Campos adicionais agrupados */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Observações
            </label>
            <textarea
              value={form.observacoes}
              onChange={(e) => setField('observacoes', e.target.value)}
              rows={3}
              className={cn(
                'w-full px-3 py-2 text-sm rounded-xl resize-none',
                'bg-slate-800 text-slate-200 placeholder:text-slate-500',
                'ring-1 ring-slate-700 focus:ring-indigo-500 outline-none transition-shadow',
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                setForm(FORM_EMPTY);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSalvar}>
              Salvar Procedimento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
