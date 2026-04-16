import { useState } from 'react';
import { Plus, Search, Archive } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MOCK_CASES } from '@/lib/mockData';
import { CaseStatus } from '@/types/case';
import { normalizeSearch } from '@/utils/normalizeSearch';
import { formatDate } from '@/utils/formatDate';

// ─── Tipos do formulário ─────────────────────────────────────────────────────

interface ArquivarForm {
  codigoPuxar: string;
  nomeCompleto: string;
  ano: string;
  perfil: string;
  responsavel: string;
  idade: string;
  sexo: string;
  nacionalidade: string;
  telefone: string;
  endereco: string;
  bairro: string;
  tipoViolencia: string;
  codigo: string;
  dataArquivamento: string;
  motivoDesligamento: string;
  observacoes: string;
}

const FORM_EMPTY: ArquivarForm = {
  codigoPuxar: '',
  nomeCompleto: '',
  ano: '2026',
  perfil: 'PAEFI',
  responsavel: '',
  idade: '',
  sexo: 'Masculino (M)',
  nacionalidade: 'Brasileira',
  telefone: '',
  endereco: '',
  bairro: '',
  tipoViolencia: '',
  codigo: '',
  dataArquivamento: '',
  motivoDesligamento: '',
  observacoes: '',
};

// ─── Dados ───────────────────────────────────────────────────────────────────

const CASOS_ARQUIVADOS = MOCK_CASES.filter((c) => c.status === CaseStatus.ARCHIVED);

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Arquivados() {
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ArquivarForm>(FORM_EMPTY);

  const casosVisiveis = CASOS_ARQUIVADOS.filter((c) =>
    normalizeSearch(c.name + c.code + c.cpf).includes(normalizeSearch(busca)),
  );

  function setField<K extends keyof ArquivarForm>(key: K, value: string) {
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
          <h2 className="text-xl font-bold text-slate-100">Arquivados</h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestão e monitoramento de atendimentos</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={cn(
                'h-9 pl-9 pr-4 text-sm rounded-xl w-52',
                'bg-slate-800 text-slate-200 placeholder:text-slate-500',
                'ring-1 ring-slate-700 focus:ring-indigo-500 outline-none transition-shadow',
              )}
            />
          </div>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="size-3.5 mr-1" />
            Adicionar cadastro
          </Button>
        </div>
      </div>

      {/* ── Tabela ── */}
      <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  '#',
                  'Perfil',
                  'Ano',
                  'Nome',
                  'Data do Arquivamento',
                  'Responsável',
                  'Idade',
                  'Sexo',
                  'Nacionalidade',
                  'Endereço',
                  'Bairro',
                  'Telefone',
                  'Tipo de Violência',
                  'Código',
                  'Motivo do Desligamento',
                  'Editar',
                ].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-left font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {casosVisiveis.length === 0 ? (
                <tr>
                  <td colSpan={16} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <Archive className="size-8 text-slate-700" strokeWidth={1.5} />
                      <p className="text-sm">Nenhum caso encontrado nesta categoria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                casosVisiveis.map((caso, idx) => {
                  const anoEntrada = new Date(caso.entryDate).getFullYear();
                  const motivoLabel = caso.archiveReason ?? '—';

                  return (
                    <tr
                      key={caso.id}
                      className="hover:bg-slate-800/40 transition-colors opacity-80"
                    >
                      <td className="px-3 py-3 text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded-md',
                            caso.service === 'PAEFI'
                              ? 'bg-indigo-500/10 text-indigo-300'
                              : 'bg-emerald-500/10 text-emerald-300',
                          )}
                        >
                          {caso.service}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-400">{anoEntrada}</td>
                      <td className="px-3 py-3 font-medium text-slate-400">{caso.name}</td>
                      <td className="px-3 py-3 text-slate-400">
                        {caso.archiveDate ? formatDate(caso.archiveDate) : '—'}
                      </td>
                      <td className="px-3 py-3 text-slate-400">{caso.responsibleName}</td>
                      <td className="px-3 py-3 text-slate-400">
                        {new Date().getFullYear() - new Date(caso.birthDate).getFullYear()}
                      </td>
                      <td className="px-3 py-3 text-slate-400">—</td>
                      <td className="px-3 py-3 text-slate-400">{caso.address}</td>
                      <td className="px-3 py-3 text-slate-400">{caso.neighborhood}</td>
                      <td className="px-3 py-3 text-slate-400">—</td>
                      <td className="px-3 py-3 text-slate-400">
                        {caso.entryReason.replace(/_/g, ' ')}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-500">{caso.code}</td>
                      <td
                        className="px-3 py-3 text-slate-400 max-w-48 truncate"
                        title={motivoLabel}
                      >
                        {motivoLabel}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          className="flex items-center justify-center size-7 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors mx-auto"
                          title="Editar"
                        >
                          <svg
                            className="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 16H7v-2a2 2 0 01.586-1.414z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {casosVisiveis.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              {casosVisiveis.length} registro{casosVisiveis.length !== 1 ? 's' : ''} arquivado
              {casosVisiveis.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* ── Modal: Arquivar Registro ── */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm(FORM_EMPTY);
        }}
        title="Arquivar Registro de Caso"
        size="lg"
      >
        <div className="space-y-5">
          {/* Puxar por código */}
          <div className="rounded-xl bg-indigo-500/5 ring-1 ring-indigo-500/20 p-4 space-y-2">
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
              Puxar dados por código
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite o código do caso..."
                value={form.codigoPuxar}
                onChange={(e) => setField('codigoPuxar', e.target.value)}
                className={cn(
                  'flex-1 h-9 px-3 text-sm rounded-xl',
                  'bg-slate-800 text-slate-200 placeholder:text-slate-500',
                  'ring-1 ring-slate-700 focus:ring-indigo-500 outline-none transition-shadow',
                )}
              />
              <Button variant="primary" size="sm">
                <Search className="size-3.5 mr-1.5" />
                Puxar Dados
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome Completo"
              value={form.nomeCompleto}
              onChange={(e) => setField('nomeCompleto', e.target.value)}
            />
            <Input label="Ano" value={form.ano} onChange={(e) => setField('ano', e.target.value)} />
            <Select
              label="Perfil"
              options={[
                { value: 'PAEFI', label: 'PAEFI' },
                { value: 'SEV', label: 'SEV' },
              ]}
              value={form.perfil}
              onChange={(e) => setField('perfil', e.target.value)}
            />
            <Input
              label="Responsável"
              value={form.responsavel}
              onChange={(e) => setField('responsavel', e.target.value)}
            />
            <Input
              label="Idade"
              value={form.idade}
              onChange={(e) => setField('idade', e.target.value)}
            />
            <Select
              label="Sexo"
              options={[
                { value: 'Masculino (M)', label: 'Masculino (M)' },
                { value: 'Feminino (F)', label: 'Feminino (F)' },
                { value: 'Outros', label: 'Outros' },
              ]}
              value={form.sexo}
              onChange={(e) => setField('sexo', e.target.value)}
            />
            <Select
              label="Nacionalidade"
              options={[
                { value: 'Brasileira', label: 'Brasileira' },
                { value: 'Estrangeira', label: 'Estrangeira' },
                { value: 'Outros', label: 'Outros' },
              ]}
              value={form.nacionalidade}
              onChange={(e) => setField('nacionalidade', e.target.value)}
            />
            <Input
              label="Telefone"
              placeholder="(xx) xxxxx-xxxx"
              value={form.telefone}
              onChange={(e) => setField('telefone', e.target.value)}
            />
            <Input
              label="Endereço"
              value={form.endereco}
              onChange={(e) => setField('endereco', e.target.value)}
            />
            <Input
              label="Bairro"
              value={form.bairro}
              onChange={(e) => setField('bairro', e.target.value)}
            />
            <Input
              label="Tipo de Violência"
              value={form.tipoViolencia}
              onChange={(e) => setField('tipoViolencia', e.target.value)}
            />
            <Input
              label="Código"
              value={form.codigo}
              onChange={(e) => setField('codigo', e.target.value)}
            />
            <Input
              label="Data do Arquivamento"
              type="date"
              value={form.dataArquivamento}
              onChange={(e) => setField('dataArquivamento', e.target.value)}
            />
            <Input
              label="Motivo do Desligamento"
              value={form.motivoDesligamento}
              onChange={(e) => setField('motivoDesligamento', e.target.value)}
            />
          </div>

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
            <Button variant="danger" onClick={handleSalvar}>
              Salvar Registro Completo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
