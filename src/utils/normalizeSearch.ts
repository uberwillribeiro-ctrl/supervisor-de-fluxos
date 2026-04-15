export function normalizeSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function matchesSearch(haystack: string, needle: string): boolean {
  return normalizeSearch(haystack).includes(normalizeSearch(needle));
}
