export enum CaseStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.NEW]: 'Novo',
  [CaseStatus.ACTIVE]: 'Ativo',
  [CaseStatus.ARCHIVED]: 'Arquivado',
};

export const ARCHIVE_REASON_OPTIONS = [
  { value: 'objetivo_cumprido', label: 'Objetivo cumprido / Resolutividade' },
  { value: 'transferencia', label: 'Transferência para outro serviço' },
  { value: 'abandono', label: 'Abandono' },
  { value: 'obito', label: 'Óbito' },
  { value: 'mudanca_endereco', label: 'Mudança de endereço' },
  { value: 'solicitacao_familia', label: 'Solicitação da família' },
  { value: 'outros', label: 'Outros' },
];

export const ENTRY_REASON_OPTIONS = [
  { value: 'violencia_domestica', label: 'Violência doméstica e familiar' },
  { value: 'negligencia', label: 'Negligência ou abandono' },
  { value: 'trabalho_infantil', label: 'Trabalho infantil' },
  { value: 'violencia_sexual', label: 'Violência sexual' },
  { value: 'vulnerabilidade_economica', label: 'Vulnerabilidade econômica' },
  { value: 'violencia_psicologica', label: 'Violência psicológica' },
  { value: 'situacao_rua', label: 'Situação de rua' },
  { value: 'uso_substancias', label: 'Uso de substâncias psicoativas' },
  { value: 'outros', label: 'Outros' },
];

export interface CaseRecord {
  id: string;
  code: string;
  name: string;
  cpf: string;
  birthDate: string;
  address: string;
  neighborhood: string;
  service: 'PAEFI' | 'SEV';
  status: CaseStatus;
  entryDate: string;
  entryReason: string;
  lastReportDate?: string;
  archiveDate?: string;
  archiveReason?: string;
  archiveNotes?: string;
  responsibleId: string;
  responsibleName: string;
  createdBy: string;
  createdAt: string;
}
