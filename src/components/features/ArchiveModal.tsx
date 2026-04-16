import { useState, type ChangeEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { type CaseRecord, ARCHIVE_REASON_OPTIONS } from '@/types/case';
import { cn } from '@/utils/cn';

interface ArchiveData {
  archiveDate: string;
  archiveReason: string;
  archiveNotes: string;
}

interface ArchiveModalProps {
  open: boolean;
  caseRecord: CaseRecord | null;
  onClose: () => void;
  onArchive: (id: string, data: ArchiveData) => void;
}

const DATE_CLASS = cn(
  'h-9 w-full rounded-lg px-3 text-sm',
  'bg-slate-800 text-slate-100',
  'border border-slate-700',
  'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
  'transition-colors',
);

const TEXTAREA_CLASS = cn(
  'w-full rounded-lg px-3 py-2 text-sm resize-none',
  'bg-slate-800 text-slate-100 placeholder:text-slate-600',
  'border border-slate-700',
  'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
  'transition-colors',
);

export function ArchiveModal({ open, caseRecord, onClose, onArchive }: ArchiveModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const [archiveDate, setArchiveDate] = useState(today);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiveNotes, setArchiveNotes] = useState('');
  const [errors, setErrors] = useState<{ archiveDate?: string; archiveReason?: string }>({});

  const reset = () => {
    setArchiveDate(today);
    setArchiveReason('');
    setArchiveNotes('');
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = () => {
    const e: { archiveDate?: string; archiveReason?: string } = {};
    if (!archiveDate) e.archiveDate = 'Data é obrigatória';
    if (!archiveReason) e.archiveReason = 'Motivo é obrigatório';
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    if (!caseRecord) return;
    onArchive(caseRecord.id, { archiveDate, archiveReason, archiveNotes });
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Arquivar: ${caseRecord?.name ?? ''}`}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-400">
          Esta ação encerrará o acompanhamento ativo do caso. Confirme os dados abaixo.
        </p>

        {/* Motivo */}
        <Select
          label="Motivo do desligamento"
          placeholder="Selecione o motivo..."
          options={ARCHIVE_REASON_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          value={archiveReason}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setArchiveReason(e.target.value);
            setErrors((er) => ({ ...er, archiveReason: undefined }));
          }}
          error={errors.archiveReason}
        />

        {/* Data */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Data do arquivamento</label>
          <input
            type="date"
            className={cn(DATE_CLASS, errors.archiveDate && 'border-red-500')}
            value={archiveDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setArchiveDate(e.target.value);
              setErrors((er) => ({ ...er, archiveDate: undefined }));
            }}
          />
          {errors.archiveDate && <p className="text-xs text-red-400">{errors.archiveDate}</p>}
        </div>

        {/* Observações */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">
            Observações <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <textarea
            className={TEXTAREA_CLASS}
            rows={3}
            placeholder="Registre detalhes relevantes sobre o desligamento..."
            value={archiveNotes}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setArchiveNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Confirmar Arquivamento
          </Button>
        </div>
      </div>
    </Modal>
  );
}
