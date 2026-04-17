import { useState } from 'react';
import { Plus, Search, ClipboardList, Download, Pencil } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useCases } from '@/hooks/useCases';
import { useProcedures } from '@/hooks/useProcedures';
import { ageRangeToRMAColumns } from '@/utils/rmaMapping';
import { type DbProcedure } from '@/lib/supabase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type ProcedimentoMock = DbProcedure;

interface ProcedimentoForm {
  codigoVincular: string;
  nome: string;
  mes: string;
  ano: string;
  servico: string;
  sexo: string;
  idade: string;
  nacionalidade: string;
  data: string;
  instituicao: string;
  responsavel: string;
  contatosExito: string;
  telefonicasSemExito: string;
  atendimentoIndividualizado: string;
  atendimentoEmGrupo: string;
  encaminhamentoCRAS: string;
  visitasDomiciliar: string;
  visitasInstitucional: string;
  visitasSemExito: string;
  casosDesligados: string;
  outrosEncaminhamentos: string;
  reuniaoFamiliar: string;
  palestras: string;
  prontuarioSUAS: string;
  relatorios: string;
  pias: string;
  parecer: string;
  atendidos0a10: string;
  atendimentos0a10: string;
  atendidos11a17: string;
  atendimentos11a17: string;
  mulheresViolencia: string;
  outros: string;
}

const FORM_EMPTY: ProcedimentoForm = {
  codigoVincular: '',
  nome: '',
  mes: '',
  ano: '2026',
  servico: 'PAEFI',
  sexo: '',
  idade: '',
  nacionalidade: '',
  data: '',
  instituicao: '',
  responsavel: '',
  contatosExito: '',
  telefonicasSemExito: '',
  atendimentoIndividualizado: '',
  atendimentoEmGrupo: '',
  encaminhamentoCRAS: '',
  visitasDomiciliar: '',
  visitasInstitucional: '',
  visitasSemExito: '',
  casosDesligados: '',
  outrosEncaminhamentos: '',
  reuniaoFamiliar: '',
  palestras: '',
  prontuarioSUAS: '',
  relatorios: '',
  pias: '',
  parecer: '',
  atendidos0a10: '',
  atendimentos0a10: '',
  atendidos11a17: '',
  atendimentos11a17: '',
  mulheresViolencia: '',
  outros: '',
};

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

// ─── Colunas da tabela (ordem exata do colunas.txt) ──────────────────────────

const COLUNAS: { key: keyof ProcedimentoMock; label: string }[] = [
  { key: 'contatos_com_exito', label: 'Contatos com êxito' },
  { key: 'telefonicos_sem_exito', label: 'Telefônicos sem êxito' },
  { key: 'atendimento_individualizado', label: 'Atendimento Individualizado' },
  { key: 'atendimento_em_grupo', label: 'Atendimento em Grupo' },
  { key: 'encaminhamento_cras', label: 'Encaminhamento p/ CRAS' },
  { key: 'visita_domiciliar', label: 'Visitas Domiciliar' },
  { key: 'visita_institucional', label: 'Visitas Institucional' },
  { key: 'visita_sem_exito', label: 'Visitas sem êxito' },
  { key: 'casos_desligados', label: 'Casos Desligados' },
  { key: 'outros_encaminhamentos', label: 'Outros encaminhamentos' },
  { key: 'reuniao_familiar', label: 'Reunião Familiar' },
  { key: 'palestras', label: 'Palestras' },
  { key: 'prontuario_suas', label: 'Prontuário SUAS' },
  { key: 'relatorios', label: 'Relatórios' },
  { key: 'pias', label: "PIA's" },
  { key: 'parecer', label: 'Parecer' },
  { key: 'atendidos_0_10_anos', label: 'Atendidos (0 a 10 anos)' },
  { key: 'atendimentos_0_10_anos', label: 'Atendimentos (0 a 10 anos)' },
  { key: 'atendidos_11_17_anos', label: 'Atendidos (11 a 17 anos)' },
  { key: 'atendimentos_11_17_anos', label: 'Atendimentos (11 a 17 anos)' },
  { key: 'mulheres_atendidas_violencia', label: 'Mulheres vítimas de Violência' },
  { key: 'others', label: 'Outros' },
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Procedimentos() {
  const [mesFiltro, setMesFiltro] = useState('Abril');
  const [anoFiltro, setAnoFiltro] = useState('2026');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProcedimentoForm>(FORM_EMPTY);
  const [buscaStatus, setBuscaStatus] = useState<'idle' | 'found' | 'notfound'>('idle');
  const [saving, setSaving] = useState(false);

  const {
    procedures: procedimentosFiltrados,
    loading,
    createProcedure,
  } = useProcedures(mesFiltro, anoFiltro);
  const { cases: allCases, getCaseByCode } = useCases();

  function setField<K extends keyof ProcedimentoForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Autopreenchimento ao localizar caso pelo código ──────────────────────

  async function handleLocalizar() {
    const codigo = form.codigoVincular.trim();
    if (!codigo) return;

    const caso = await getCaseByCode(codigo);

    if (!caso) {
      // fallback: busca local na lista já carregada
      const local = allCases.find((c) => c.code?.toLowerCase() === codigo.toLowerCase());
      if (!local) {
        setBuscaStatus('notfound');
        return;
      }
      const idadeNum = local.age ?? 0;
      const faixaRMA = ageRangeToRMAColumns(idadeNum);
      setForm((prev) => ({
        ...prev,
        nome: local.name,
        servico: local.profile ?? prev.servico,
        responsavel: local.responsible ?? '',
        nacionalidade: local.nationality ?? 'Brasileira',
        sexo: local.sex ?? '',
        idade: String(idadeNum),
        atendidos0a10: faixaRMA?.atendidos === 'atendidos0a10' ? '1' : prev.atendidos0a10,
        atendimentos0a10:
          faixaRMA?.atendimentos === 'atendimentos0a10' ? '1' : prev.atendimentos0a10,
        atendidos11a17: faixaRMA?.atendidos === 'atendidos11a17' ? '1' : prev.atendidos11a17,
        atendimentos11a17:
          faixaRMA?.atendimentos === 'atendimentos11a17' ? '1' : prev.atendimentos11a17,
      }));
      setBuscaStatus('found');
      return;
    }

    const idadeNum = caso.age ?? 0;
    const faixaRMA = ageRangeToRMAColumns(idadeNum);

    setForm((prev) => ({
      ...prev,
      nome: caso.name,
      servico: caso.profile ?? prev.servico,
      responsavel: caso.responsible ?? '',
      nacionalidade: caso.nationality ?? 'Brasileira',
      sexo: caso.sex ?? '',
      idade: String(idadeNum),
      atendidos0a10: faixaRMA?.atendidos === 'atendidos0a10' ? '1' : prev.atendidos0a10,
      atendimentos0a10: faixaRMA?.atendimentos === 'atendimentos0a10' ? '1' : prev.atendimentos0a10,
      atendidos11a17: faixaRMA?.atendidos === 'atendidos11a17' ? '1' : prev.atendidos11a17,
      atendimentos11a17:
        faixaRMA?.atendimentos === 'atendimentos11a17' ? '1' : prev.atendimentos11a17,
    }));
    setBuscaStatus('found');
  }

  async function handleSalvar() {
    setSaving(true);
    await createProcedure({
      case_id: null,
      name: form.nome || null,
      month: form.mes || null,
      year: parseInt(form.ano, 10) || null,
      service: form.servico || null,
      category: null,
      sex: form.sexo || null,
      age: parseInt(form.idade, 10) || null,
      nationality: form.nacionalidade || null,
      date: form.data || null,
      institution: null,
      contatos_com_exito: parseInt(form.contatosExito, 10) || null,
      telefonicos_sem_exito: parseInt(form.telefonicasSemExito, 10) || null,
      atendimento_individualizado: parseInt(form.atendimentoIndividualizado, 10) || null,
      atendimento_em_grupo: parseInt(form.atendimentoEmGrupo, 10) || null,
      encaminhamento_cras: parseInt(form.encaminhamentoCRAS, 10) || null,
      visita_domiciliar: parseInt(form.visitasDomiciliar, 10) || null,
      visita_institucional: parseInt(form.visitasInstitucional, 10) || null,
      visita_sem_exito: parseInt(form.visitasSemExito, 10) || null,
      casos_desligados: parseInt(form.casosDesligados, 10) || null,
      outros_encaminhamentos: parseInt(form.outrosEncaminhamentos, 10) || null,
      reuniao_familiar: parseInt(form.reuniaoFamiliar, 10) || null,
      palestras: parseInt(form.palestras, 10) || null,
      prontuario_suas: parseInt(form.prontuarioSUAS, 10) || null,
      relatorios: parseInt(form.relatorios, 10) || null,
      pias: parseInt(form.pias, 10) || null,
      parecer: parseInt(form.parecer, 10) || null,
      atendidos_0_10_anos: parseInt(form.atendidos0a10, 10) || null,
      atendimentos_0_10_anos: parseInt(form.atendimentos0a10, 10) || null,
      atendidos_11_17_anos: parseInt(form.atendidos11a17, 10) || null,
      atendimentos_11_17_anos: parseInt(form.atendimentos11a17, 10) || null,
      mulheres_atendidas_violencia: parseInt(form.mulheresViolencia, 10) || null,
      others: form.outros || null,
      user_id: null,
    });
    setSaving(false);
    setModalOpen(false);
    setForm(FORM_EMPTY);
    setBuscaStatus('idle');
  }

  function handleFecharModal() {
    setModalOpen(false);
    setForm(FORM_EMPTY);
    setBuscaStatus('idle');
  }

  // helper: valor numérico de uma coluna
  function val(p: ProcedimentoMock, key: keyof ProcedimentoMock): number {
    const v = p[key];
    return typeof v === 'number' ? v : 0;
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
                {[
                  '#',
                  'Nome',
                  'Mês',
                  'ANO',
                  'Serviço',
                  'Sexo',
                  'Idade',
                  'Nacionalidade',
                  'Data',
                  'Instituição',
                ].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {col}
                  </th>
                ))}
                {COLUNAS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold uppercase tracking-wider text-slate-500">
                  Editar
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={33} className="py-16 text-center text-slate-500 text-sm">
                    Carregando...
                  </td>
                </tr>
              ) : procedimentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={33} className="py-16 text-center">
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
                    <td className="px-3 py-3 font-medium text-slate-200">{p.name ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-400">{p.month ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-400">{p.year ?? '—'}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-md',
                          p.service === 'PAEFI'
                            ? 'bg-indigo-500/10 text-indigo-300'
                            : 'bg-emerald-500/10 text-emerald-300',
                        )}
                      >
                        {p.service ?? '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{p.sex ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-400">{p.age ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-400">{p.nationality ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-400">{p.date ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-400">{p.institution ?? '—'}</td>
                    {COLUNAS.map((col) => {
                      const v = val(p, col.key);
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
                    <td className="px-3 py-3 text-center">
                      <button
                        className="flex items-center justify-center size-7 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors mx-auto"
                        title="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Totalizador */}
            {procedimentosFiltrados.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-800/50">
                  <td
                    colSpan={10}
                    className="px-3 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide"
                  >
                    Total do Mês
                  </td>
                  {COLUNAS.map((col) => {
                    const soma = procedimentosFiltrados.reduce(
                      (acc, p) => acc + val(p, col.key),
                      0,
                    );
                    return (
                      <td key={col.key} className="px-3 py-3 text-center font-bold text-slate-200">
                        {soma > 0 ? soma : <span className="text-slate-600">0</span>}
                      </td>
                    );
                  })}
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Modal: Registrar Procedimento ── */}
      <Modal open={modalOpen} onClose={handleFecharModal} title="Registrar Procedimento" size="lg">
        <div className="space-y-5">
          {/* Vincular caso pelo código */}
          <div className="rounded-xl bg-indigo-500/5 ring-1 ring-indigo-500/20 p-4 space-y-2">
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
              Vincular caso pelo código
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: CAS-2026-0008"
                value={form.codigoVincular}
                onChange={(e) => {
                  setField('codigoVincular', e.target.value);
                  setBuscaStatus('idle');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLocalizar()}
                className={cn(
                  'flex-1 h-9 px-3 text-sm rounded-xl',
                  'bg-slate-800 text-slate-200 placeholder:text-slate-500',
                  'ring-1 outline-none transition-shadow',
                  buscaStatus === 'found' && 'ring-emerald-500',
                  buscaStatus === 'notfound' && 'ring-red-500',
                  buscaStatus === 'idle' && 'ring-slate-700 focus:ring-indigo-500',
                )}
              />
              <Button variant="primary" size="sm" onClick={handleLocalizar}>
                <Search className="size-3.5 mr-1.5" />
                Localizar
              </Button>
            </div>
            {buscaStatus === 'found' && (
              <p className="text-[11px] text-emerald-400">
                Caso encontrado — campos preenchidos automaticamente.
              </p>
            )}
            {buscaStatus === 'notfound' && (
              <p className="text-[11px] text-red-400">Nenhum caso encontrado com esse código.</p>
            )}
            {buscaStatus === 'idle' && (
              <p className="text-[11px] text-indigo-400/70">
                Digite o código e clique em Localizar para autocompletar os campos abaixo.
              </p>
            )}
          </div>

          {/* Identificação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome"
              value={form.nome}
              onChange={(e) => setField('nome', e.target.value)}
            />
            <Select
              label="Mês"
              placeholder="Selecione..."
              options={MESES.map((m) => ({ value: m, label: m }))}
              value={form.mes}
              onChange={(e) => setField('mes', e.target.value)}
            />
            <Input label="Ano" value={form.ano} onChange={(e) => setField('ano', e.target.value)} />
            <Select
              label="Serviço"
              options={[
                { value: 'PAEFI', label: 'PAEFI' },
                { value: 'SEV', label: 'SEV' },
              ]}
              value={form.servico}
              onChange={(e) => setField('servico', e.target.value)}
            />
            <Select
              label="Sexo"
              options={[
                { value: 'Feminino (F)', label: 'Feminino (F)' },
                { value: 'Masculino (M)', label: 'Masculino (M)' },
              ]}
              value={form.sexo}
              onChange={(e) => setField('sexo', e.target.value)}
            />
            <Input
              label="Idade"
              value={form.idade}
              onChange={(e) => setField('idade', e.target.value)}
            />
            <Select
              label="Nacionalidade"
              options={[
                { value: 'Brasileira', label: 'Brasileira' },
                { value: 'Estrangeira', label: 'Estrangeira' },
              ]}
              value={form.nacionalidade}
              onChange={(e) => setField('nacionalidade', e.target.value)}
            />
            <Input
              label="Data"
              type="date"
              value={form.data}
              onChange={(e) => setField('data', e.target.value)}
            />
            <Input
              label="Instituição"
              value={form.instituicao}
              onChange={(e) => setField('instituicao', e.target.value)}
            />
            <Input
              label="Responsável"
              placeholder="Preenchido automaticamente..."
              value={form.responsavel}
              onChange={(e) => setField('responsavel', e.target.value)}
            />
          </div>

          {/* Contadores */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Contadores
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="Contatos com êxito"
                value={form.contatosExito}
                onChange={(e) => setField('contatosExito', e.target.value)}
              />
              <Input
                label="Telefônicos sem êxito"
                value={form.telefonicasSemExito}
                onChange={(e) => setField('telefonicasSemExito', e.target.value)}
              />
              <Input
                label="Atend. Individualizado"
                value={form.atendimentoIndividualizado}
                onChange={(e) => setField('atendimentoIndividualizado', e.target.value)}
              />
              <Input
                label="Atendimento em Grupo"
                value={form.atendimentoEmGrupo}
                onChange={(e) => setField('atendimentoEmGrupo', e.target.value)}
              />
              <Input
                label="Encaminhamento CRAS"
                value={form.encaminhamentoCRAS}
                onChange={(e) => setField('encaminhamentoCRAS', e.target.value)}
              />
              <Input
                label="Visitas Domiciliar"
                value={form.visitasDomiciliar}
                onChange={(e) => setField('visitasDomiciliar', e.target.value)}
              />
              <Input
                label="Visitas Institucional"
                value={form.visitasInstitucional}
                onChange={(e) => setField('visitasInstitucional', e.target.value)}
              />
              <Input
                label="Visitas sem êxito"
                value={form.visitasSemExito}
                onChange={(e) => setField('visitasSemExito', e.target.value)}
              />
              <Input
                label="Casos Desligados"
                value={form.casosDesligados}
                onChange={(e) => setField('casosDesligados', e.target.value)}
              />
              <Input
                label="Outros encaminhamentos"
                value={form.outrosEncaminhamentos}
                onChange={(e) => setField('outrosEncaminhamentos', e.target.value)}
              />
              <Input
                label="Reunião Familiar"
                value={form.reuniaoFamiliar}
                onChange={(e) => setField('reuniaoFamiliar', e.target.value)}
              />
              <Input
                label="Palestras"
                value={form.palestras}
                onChange={(e) => setField('palestras', e.target.value)}
              />
              <Input
                label="Prontuário SUAS"
                value={form.prontuarioSUAS}
                onChange={(e) => setField('prontuarioSUAS', e.target.value)}
              />
              <Input
                label="Relatórios"
                value={form.relatorios}
                onChange={(e) => setField('relatorios', e.target.value)}
              />
              <Input
                label="PIA's"
                value={form.pias}
                onChange={(e) => setField('pias', e.target.value)}
              />
              <Input
                label="Parecer"
                value={form.parecer}
                onChange={(e) => setField('parecer', e.target.value)}
              />
              <Input
                label="Atendidos (0 a 10 anos)"
                value={form.atendidos0a10}
                onChange={(e) => setField('atendidos0a10', e.target.value)}
              />
              <Input
                label="Atendimentos (0 a 10 anos)"
                value={form.atendimentos0a10}
                onChange={(e) => setField('atendimentos0a10', e.target.value)}
              />
              <Input
                label="Atendidos (11 a 17 anos)"
                value={form.atendidos11a17}
                onChange={(e) => setField('atendidos11a17', e.target.value)}
              />
              <Input
                label="Atendimentos (11 a 17 anos)"
                value={form.atendimentos11a17}
                onChange={(e) => setField('atendimentos11a17', e.target.value)}
              />
              <Input
                label="Mulheres vítimas de Violência"
                value={form.mulheresViolencia}
                onChange={(e) => setField('mulheresViolencia', e.target.value)}
              />
              <Input
                label="Outros"
                value={form.outros}
                onChange={(e) => setField('outros', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={handleFecharModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSalvar} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Procedimento'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
