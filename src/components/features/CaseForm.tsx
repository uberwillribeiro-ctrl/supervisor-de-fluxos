import { useState, type ChangeEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { type CaseRecord, CaseStatus, ENTRY_REASON_OPTIONS } from '@/types/case';
import { type UserProfile } from '@/types/user';
import { cn } from '@/utils/cn';

interface CaseFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (c: CaseRecord) => void;
  nextCode: string;
  currentUserId: string;
  technicians: UserProfile[];
}

interface FormState {
  name: string;
  cpf: string;
  code: string;
  birthDate: string;
  address: string;
  neighborhood: string;
  responsibleId: string;
  service: string;
  entryReason: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const NEIGHBORHOOD_OPTIONS = [
  'Bela Vista',
  'Bom Retiro',
  'Campos Elíseos',
  'Centro',
  'Jardim América',
  'Nova Esperança',
  'Parque das Flores',
  'Santa Cruz',
  'São José',
  'Vila Operária',
].map((n) => ({ value: n, label: n }));

const DATE_CLASS = cn(
  'h-9 w-full rounded-lg px-3 text-sm',
  'bg-slate-800 text-slate-100',
  'border border-slate-700',
  'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
  'transition-colors',
);

const EMPTY: FormState = {
  name: '',
  cpf: '',
  code: '',
  birthDate: '',
  address: '',
  neighborhood: '',
  responsibleId: '',
  service: '',
  entryReason: '',
};

export function CaseForm({
  open,
  onClose,
  onCreate,
  nextCode,
  currentUserId,
  technicians,
}: CaseFormProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, code: nextCode });
  const [errors, setErrors] = useState<FormErrors>({});

  const onInput = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const onSelect = (field: keyof FormState) => (e: ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Nome é obrigatório';
    if (!form.cpf.trim()) e.cpf = 'CPF é obrigatório';
    if (!form.code.trim()) e.code = 'Código é obrigatório';
    if (!form.birthDate) e.birthDate = 'Data de nascimento é obrigatória';
    if (!form.address.trim()) e.address = 'Endereço é obrigatório';
    if (!form.neighborhood) e.neighborhood = 'Bairro é obrigatório';
    if (!form.responsibleId) e.responsibleId = 'Responsável é obrigatório';
    if (!form.service) e.service = 'Serviço é obrigatório';
    if (!form.entryReason) e.entryReason = 'Motivo é obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setForm({ ...EMPTY, code: nextCode });
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const responsible = technicians.find((t) => t.id === form.responsibleId)!;
    const today = new Date().toISOString().split('T')[0];
    const newCase: CaseRecord = {
      id: `case-${Date.now()}`,
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      cpf: form.cpf.trim(),
      birthDate: form.birthDate,
      address: form.address.trim(),
      neighborhood: form.neighborhood,
      service: form.service as 'PAEFI' | 'SEV',
      status: CaseStatus.NEW,
      entryDate: today,
      entryReason: form.entryReason,
      responsibleId: form.responsibleId,
      responsibleName: responsible.name,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
    };
    onCreate(newCase);
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Novo Caso" size="xl">
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="sm:col-span-2">
            <Input
              label="Nome completo"
              placeholder="Nome do beneficiário"
              value={form.name}
              onChange={onInput('name')}
              error={errors.name}
            />
          </div>

          {/* CPF */}
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChange={onInput('cpf')}
            error={errors.cpf}
          />

          {/* Código */}
          <Input
            label="Código do caso"
            placeholder="CAS-2026-0000"
            value={form.code}
            onChange={onInput('code')}
            error={errors.code}
          />

          {/* Data de nascimento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Data de nascimento</label>
            <input
              type="date"
              className={cn(DATE_CLASS, errors.birthDate && 'border-red-500')}
              value={form.birthDate}
              onChange={onInput('birthDate')}
            />
            {errors.birthDate && <p className="text-xs text-red-400">{errors.birthDate}</p>}
          </div>

          {/* Serviço */}
          <Select
            label="Serviço"
            placeholder="Selecione..."
            options={[
              { value: 'PAEFI', label: 'PAEFI' },
              { value: 'SEV', label: 'SEV' },
            ]}
            value={form.service}
            onChange={onSelect('service')}
            error={errors.service}
          />

          {/* Endereço */}
          <div className="sm:col-span-2">
            <Input
              label="Endereço"
              placeholder="Rua, número"
              value={form.address}
              onChange={onInput('address')}
              error={errors.address}
            />
          </div>

          {/* Bairro */}
          <Select
            label="Bairro"
            placeholder="Selecione o bairro..."
            options={NEIGHBORHOOD_OPTIONS}
            value={form.neighborhood}
            onChange={onSelect('neighborhood')}
            error={errors.neighborhood}
          />

          {/* Responsável */}
          <Select
            label="Técnico responsável"
            placeholder="Selecione..."
            options={technicians.map((t) => ({ value: t.id, label: t.name }))}
            value={form.responsibleId}
            onChange={onSelect('responsibleId')}
            error={errors.responsibleId}
          />

          {/* Motivo da entrada */}
          <div className="sm:col-span-2">
            <Select
              label="Motivo da entrada"
              placeholder="Selecione o motivo..."
              options={ENTRY_REASON_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={form.entryReason}
              onChange={onSelect('entryReason')}
              error={errors.entryReason}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Cadastrar Caso
          </Button>
        </div>
      </div>
    </Modal>
  );
}
