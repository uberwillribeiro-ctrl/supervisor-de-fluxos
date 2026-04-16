export interface ProcedureRecord {
  id: string;
  caseId: string;
  caseName: string;
  mes: string;
  ano: number;
  servico: 'PAEFI' | 'SEV';
  sexo: string;
  idade: number;
  nacionalidade: string;
  data: string;
  instituicao: string;
  responsavel: string;
  // Contadores RMA
  contatosExito: number;
  telefonicasSemExito: number;
  atendimentoIndividualizado: number;
  atendimentoEmGrupo: number;
  encaminhamentoCRAS: number;
  visitasDomiciliar: number;
  visitasInstitucional: number;
  visitasSemExito: number;
  casosDesligados: number;
  outrosEncaminhamentos: number;
  reuniaoFamiliar: number;
  palestras: number;
  prontuarioSUAS: number;
  relatorios: number;
  pias: number;
  parecer: number;
  atendidos0a10: number;
  atendimentos0a10: number;
  atendidos11a17: number;
  atendimentos11a17: number;
  mulheresViolencia: number;
  outros: number;
  // Meta
  createdBy: string;
  createdAt: string;
}
