import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type ProcedureRecord } from '@/types/procedure';
import { aggregateRMA, RMAColumn } from '@/utils/rmaMapping';

// ─── Labels das colunas RMA (ordem oficial) ───────────────────────────────────

const RMA_LABELS: { key: RMAColumn; label: string }[] = [
  { key: RMAColumn.CONTATOS_EXITO, label: 'Contatos c/ êxito' },
  { key: RMAColumn.TELEFONICAS_SEM_EXITO, label: 'Tel. s/ êxito' },
  { key: RMAColumn.ATEND_INDIVIDUALIZADO, label: 'Atend. Individual.' },
  { key: RMAColumn.ATEND_GRUPO, label: 'Atend. Grupo' },
  { key: RMAColumn.ENCAMINHAMENTO_CRAS, label: 'Enc. CRAS' },
  { key: RMAColumn.VISITAS_DOMICILIAR, label: 'Vis. Domiciliar' },
  { key: RMAColumn.VISITAS_INSTITUCIONAL, label: 'Vis. Institucional' },
  { key: RMAColumn.VISITAS_SEM_EXITO, label: 'Vis. s/ êxito' },
  { key: RMAColumn.CASOS_DESLIGADOS, label: 'Casos Deslig.' },
  { key: RMAColumn.OUTROS_ENCAMINHAMENTOS, label: 'Outros Enc.' },
  { key: RMAColumn.REUNIAO_FAMILIAR, label: 'Reun. Familiar' },
  { key: RMAColumn.PALESTRAS, label: 'Palestras' },
  { key: RMAColumn.PRONTUARIO_SUAS, label: 'Pront. SUAS' },
  { key: RMAColumn.RELATORIOS, label: 'Relatórios' },
  { key: RMAColumn.PIAS, label: "PIA's" },
  { key: RMAColumn.PARECER, label: 'Parecer' },
  { key: RMAColumn.ATENDIDOS_0_10, label: 'At. 0-10' },
  { key: RMAColumn.ATENDIMENTOS_0_10, label: 'Atm. 0-10' },
  { key: RMAColumn.ATENDIDOS_11_17, label: 'At. 11-17' },
  { key: RMAColumn.ATENDIMENTOS_11_17, label: 'Atm. 11-17' },
  { key: RMAColumn.MULHERES_VIOLENCIA, label: 'Mulh. Viol.' },
  { key: RMAColumn.OUTROS, label: 'Outros' },
];

export interface RMAPDFOptions {
  procedures: ProcedureRecord[];
  month: string;
  year: string;
  service: string;
  unit?: string;
}

export function generateRMAPDF({
  procedures,
  month,
  year,
  service,
  unit = 'CREAS Centro',
}: RMAPDFOptions): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const serviceLabel = service === 'ALL' ? 'PAEFI + SEV' : service;
  const geradoEm = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // ── Cabeçalho ────────────────────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(unit, 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Relatório Mensal de Atendimentos (RMA) — ${serviceLabel}`, 14, 20);
  doc.text(`Referência: ${month}/${year}`, 14, 26);

  // ── Tabela por técnico ────────────────────────────────────────────────────────
  // Agrupa por responsável
  const byResponsavel: Record<string, ProcedureRecord[]> = {};
  for (const p of procedures) {
    const key = p.responsavel || 'Não informado';
    if (!byResponsavel[key]) byResponsavel[key] = [];
    byResponsavel[key].push(p);
  }

  const head = [['Técnico', ...RMA_LABELS.map((c) => c.label)]];
  const body: (string | number)[][] = [];

  for (const [responsavel, procs] of Object.entries(byResponsavel)) {
    const totals = aggregateRMA(procs);
    body.push([responsavel, ...RMA_LABELS.map((c) => totals[c.key] || 0)]);
  }

  // Linha de total geral
  const totalGeral = aggregateRMA(procedures);
  body.push(['TOTAL GERAL', ...RMA_LABELS.map((c) => totalGeral[c.key] || 0)]);

  autoTable(doc, {
    head,
    body,
    startY: 32,
    styles: { fontSize: 6.5, cellPadding: 1.5 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', fontSize: 6 },
    footStyles: { fillColor: [30, 41, 59] },
    didParseCell: (data) => {
      // Destaca linha de total geral
      if (data.row.index === body.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [30, 41, 59];
        data.cell.styles.textColor = 255;
      }
      // Destaca células zeradas em amarelo
      if (data.section === 'body' && data.column.index > 0) {
        const val = Number(data.cell.raw);
        if (val === 0 && data.row.index < body.length - 1) {
          data.cell.styles.textColor = [100, 116, 139];
        }
      }
    },
    columnStyles: { 0: { cellWidth: 30 } },
  });

  // ── Rodapé ───────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Gerado em ${geradoEm} — Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' },
    );
  }

  doc.save(`RMA_${serviceLabel}_${month}_${year}.pdf`);
}
