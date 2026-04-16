import { type CaseRecord, CaseStatus } from '@/types/case';

export function daysWithoutReport(c: CaseRecord): number {
  const ref = c.lastReportDate ? new Date(c.lastReportDate) : new Date(c.entryDate);
  const now = new Date();
  return Math.floor((now.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}

export function isInactive(c: CaseRecord): boolean {
  return c.status === CaseStatus.ACTIVE && daysWithoutReport(c) > 30;
}
