export enum CaseStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

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
  archiveDate?: string;
  archiveReason?: string;
  responsibleId: string;
  createdBy: string;
  createdAt: string;
}
