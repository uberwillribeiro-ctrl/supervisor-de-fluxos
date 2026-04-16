import { type ProcedureRecord } from '@/types/procedure';

// ─── Enum das colunas RMA oficiais ────────────────────────────────────────────

export enum RMAColumn {
  CONTATOS_EXITO = 'contatosExito',
  TELEFONICAS_SEM_EXITO = 'telefonicasSemExito',
  ATEND_INDIVIDUALIZADO = 'atendimentoIndividualizado',
  ATEND_GRUPO = 'atendimentoEmGrupo',
  ENCAMINHAMENTO_CRAS = 'encaminhamentoCRAS',
  VISITAS_DOMICILIAR = 'visitasDomiciliar',
  VISITAS_INSTITUCIONAL = 'visitasInstitucional',
  VISITAS_SEM_EXITO = 'visitasSemExito',
  CASOS_DESLIGADOS = 'casosDesligados',
  OUTROS_ENCAMINHAMENTOS = 'outrosEncaminhamentos',
  REUNIAO_FAMILIAR = 'reuniaoFamiliar',
  PALESTRAS = 'palestras',
  PRONTUARIO_SUAS = 'prontuarioSUAS',
  RELATORIOS = 'relatorios',
  PIAS = 'pias',
  PARECER = 'parecer',
  ATENDIDOS_0_10 = 'atendidos0a10',
  ATENDIMENTOS_0_10 = 'atendimentos0a10',
  ATENDIDOS_11_17 = 'atendidos11a17',
  ATENDIMENTOS_11_17 = 'atendimentos11a17',
  MULHERES_VIOLENCIA = 'mulheresViolencia',
  OUTROS = 'outros',
}

export type RMACounters = Record<RMAColumn, number>;

// ─── Extrai os contadores RMA de um ProcedureRecord ──────────────────────────

export function extractRMACounters(proc: ProcedureRecord): RMACounters {
  return {
    [RMAColumn.CONTATOS_EXITO]: proc.contatosExito,
    [RMAColumn.TELEFONICAS_SEM_EXITO]: proc.telefonicasSemExito,
    [RMAColumn.ATEND_INDIVIDUALIZADO]: proc.atendimentoIndividualizado,
    [RMAColumn.ATEND_GRUPO]: proc.atendimentoEmGrupo,
    [RMAColumn.ENCAMINHAMENTO_CRAS]: proc.encaminhamentoCRAS,
    [RMAColumn.VISITAS_DOMICILIAR]: proc.visitasDomiciliar,
    [RMAColumn.VISITAS_INSTITUCIONAL]: proc.visitasInstitucional,
    [RMAColumn.VISITAS_SEM_EXITO]: proc.visitasSemExito,
    [RMAColumn.CASOS_DESLIGADOS]: proc.casosDesligados,
    [RMAColumn.OUTROS_ENCAMINHAMENTOS]: proc.outrosEncaminhamentos,
    [RMAColumn.REUNIAO_FAMILIAR]: proc.reuniaoFamiliar,
    [RMAColumn.PALESTRAS]: proc.palestras,
    [RMAColumn.PRONTUARIO_SUAS]: proc.prontuarioSUAS,
    [RMAColumn.RELATORIOS]: proc.relatorios,
    [RMAColumn.PIAS]: proc.pias,
    [RMAColumn.PARECER]: proc.parecer,
    [RMAColumn.ATENDIDOS_0_10]: proc.atendidos0a10,
    [RMAColumn.ATENDIMENTOS_0_10]: proc.atendimentos0a10,
    [RMAColumn.ATENDIDOS_11_17]: proc.atendidos11a17,
    [RMAColumn.ATENDIMENTOS_11_17]: proc.atendimentos11a17,
    [RMAColumn.MULHERES_VIOLENCIA]: proc.mulheresViolencia,
    [RMAColumn.OUTROS]: proc.outros,
  };
}

// ─── Agrega múltiplos procedimentos em totais RMA ────────────────────────────

export function aggregateRMA(procedures: ProcedureRecord[]): RMACounters {
  const zero = Object.values(RMAColumn).reduce(
    (acc, col) => ({ ...acc, [col]: 0 }),
    {} as RMACounters,
  );

  return procedures.reduce((acc, proc) => {
    const counters = extractRMACounters(proc);
    for (const col of Object.values(RMAColumn)) {
      acc[col] = (acc[col] ?? 0) + (counters[col] ?? 0);
    }
    return acc;
  }, zero);
}

// ─── Faixa etária → colunas RMA correspondentes ──────────────────────────────

export function ageRangeToRMAColumns(idade: number): {
  atendidos: RMAColumn;
  atendimentos: RMAColumn;
} | null {
  if (idade <= 10) {
    return { atendidos: RMAColumn.ATENDIDOS_0_10, atendimentos: RMAColumn.ATENDIMENTOS_0_10 };
  }
  if (idade <= 17) {
    return { atendidos: RMAColumn.ATENDIDOS_11_17, atendimentos: RMAColumn.ATENDIMENTOS_11_17 };
  }
  return null; // 18+ não tem coluna própria de atendidos por faixa no RMA
}
