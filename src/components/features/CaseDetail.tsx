import { type ElementType } from 'react';
import { MapPin, User, Clock, Calendar, FileText, Hash } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { InactivityAlert } from './InactivityAlert';
import {
  type CaseRecord,
  CaseStatus,
  CASE_STATUS_LABELS,
  ENTRY_REASON_OPTIONS,
  ARCHIVE_REASON_OPTIONS,
} from '@/types/case';
import { isInactive, daysWithoutReport } from '@/utils/caseUtils';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { getAge } from '@/utils/ageRange';

const STATUS_BADGE_VARIANTS: Record<CaseStatus, 'novo' | 'ativo' | 'arquivado'> = {
  [CaseStatus.NEW]: 'novo',
  [CaseStatus.ACTIVE]: 'ativo',
  [CaseStatus.ARCHIVED]: 'arquivado',
};

interface InfoRowProps {
  icon: ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex items-center justify-center size-7 rounded-lg bg-slate-800 shrink-0">
        <Icon className="size-3.5 text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-100 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

interface CaseDetailProps {
  caseRecord: CaseRecord | null;
  open: boolean;
  onClose: () => void;
  onArchive: (c: CaseRecord) => void;
  onReactivate: (id: string) => void;
}

export function CaseDetail({
  caseRecord,
  open,
  onClose,
  onArchive,
  onReactivate,
}: CaseDetailProps) {
  // Não retorna null cedo: o Modal precisa receber open=false para animar a saída.
  // O conteúdo fica condicional dentro do Modal.
  const c = caseRecord;

  const inactive = c ? isInactive(c) : false;
  const days = inactive && c ? daysWithoutReport(c) : 0;
  const age = c ? getAge(c.birthDate) : 0;

  const entryReasonLabel = c
    ? (ENTRY_REASON_OPTIONS.find((o) => o.value === c.entryReason)?.label ?? c.entryReason)
    : '';

  const archiveReasonLabel = c?.archiveReason
    ? (ARCHIVE_REASON_OPTIONS.find((o) => o.value === c.archiveReason)?.label ?? c.archiveReason)
    : null;

  return (
    <Modal open={open} onClose={onClose} title={c?.name ?? ''} size="xl">
      {c && (
        <div className="space-y-5">
          {/* Status + código + serviço */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_BADGE_VARIANTS[c.status]}>{CASE_STATUS_LABELS[c.status]}</Badge>
            <span className="font-mono text-xs text-slate-500">{c.code}</span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
              {c.service}
            </span>
          </div>

          {/* Alerta de inatividade */}
          {inactive && <InactivityAlert days={days} />}

          <Divider label="Dados pessoais" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={User} label="CPF" value={c.cpf} />
            <InfoRow
              icon={Calendar}
              label="Data de nascimento"
              value={`${formatDate(c.birthDate)} (${age} anos)`}
            />
            <InfoRow icon={MapPin} label="Endereço" value={c.address} />
            <InfoRow icon={MapPin} label="Bairro" value={c.neighborhood} />
          </div>

          <Divider label="Acompanhamento" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={Calendar} label="Data de entrada" value={formatDate(c.entryDate)} />
            <InfoRow icon={User} label="Técnico responsável" value={c.responsibleName} />
            <InfoRow icon={FileText} label="Motivo da entrada" value={entryReasonLabel} />
            <InfoRow
              icon={Clock}
              label="Último relatório"
              value={c.lastReportDate ? formatRelative(c.lastReportDate) : 'Sem registros'}
            />
          </div>

          {/* Informações de desligamento */}
          {c.status === CaseStatus.ARCHIVED && c.archiveDate && (
            <>
              <Divider label="Desligamento" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow
                  icon={Calendar}
                  label="Data do arquivamento"
                  value={formatDate(c.archiveDate)}
                />
                {archiveReasonLabel && (
                  <InfoRow icon={Hash} label="Motivo do desligamento" value={archiveReasonLabel} />
                )}
                {c.archiveNotes && (
                  <div className="sm:col-span-2">
                    <InfoRow icon={FileText} label="Observações" value={c.archiveNotes} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
            {c.status !== CaseStatus.ARCHIVED && (
              <Button variant="danger" onClick={() => onArchive(c)}>
                Arquivar Caso
              </Button>
            )}
            {c.status === CaseStatus.ARCHIVED && (
              <Button variant="secondary" onClick={() => onReactivate(c.id)}>
                Reativar Caso
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
