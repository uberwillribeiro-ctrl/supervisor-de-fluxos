export enum ProcedureType {
  ACOLHIDA = 'ACOLHIDA',
  VISITA_DOMICILIAR = 'VISITA_DOMICILIAR',
  ATENDIMENTO_INDIVIDUAL = 'ATENDIMENTO_INDIVIDUAL',
  ATENDIMENTO_FAMILIAR = 'ATENDIMENTO_FAMILIAR',
  ATENDIMENTO_GRUPO = 'ATENDIMENTO_GRUPO',
  ENCAMINHAMENTO = 'ENCAMINHAMENTO',
  ARTICULACAO_REDE = 'ARTICULACAO_REDE',
  REUNIAO_TECNICA = 'REUNIAO_TECNICA',
  CAPACITACAO = 'CAPACITACAO',
}

export const PROCEDURE_TYPE_LABELS: Record<ProcedureType, string> = {
  [ProcedureType.ACOLHIDA]: 'Acolhida',
  [ProcedureType.VISITA_DOMICILIAR]: 'Visita Domiciliar',
  [ProcedureType.ATENDIMENTO_INDIVIDUAL]: 'Atendimento Individual',
  [ProcedureType.ATENDIMENTO_FAMILIAR]: 'Atendimento Familiar',
  [ProcedureType.ATENDIMENTO_GRUPO]: 'Atendimento em Grupo',
  [ProcedureType.ENCAMINHAMENTO]: 'Encaminhamento',
  [ProcedureType.ARTICULACAO_REDE]: 'Articulação de Rede',
  [ProcedureType.REUNIAO_TECNICA]: 'Reunião Técnica',
  [ProcedureType.CAPACITACAO]: 'Capacitação',
};

export interface ProcedureRecord {
  id: string;
  caseId: string;
  type: ProcedureType;
  date: string;
  responsibleId: string;
  participants010: number;
  participants1117: number;
  participants18plus: number;
  rmaColumn?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}
