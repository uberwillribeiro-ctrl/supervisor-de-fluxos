export type AgeRange = '0-10' | '11-17' | '18+';

export function getAgeRange(birthDate: string | Date, referenceDate?: Date): AgeRange {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const ref = referenceDate ?? new Date();

  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age -= 1;
  }

  if (age <= 10) return '0-10';
  if (age <= 17) return '11-17';
  return '18+';
}

export function getAge(birthDate: string | Date, referenceDate?: Date): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const ref = referenceDate ?? new Date();

  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  '0-10': 'Criança (0–10)',
  '11-17': 'Adolescente (11–17)',
  '18+': 'Adulto (18+)',
};
