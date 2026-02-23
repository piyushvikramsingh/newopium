export const normalizeSearchInput = (value: string, maxLength = 64) =>
  value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);

export const escapeIlikePattern = (value: string) =>
  value.replace(/[%_\\]/g, (char) => `\\${char}`);

export const buildOrIlikeClause = (columns: string[], rawValue: string) => {
  const normalized = normalizeSearchInput(rawValue);
  const escaped = escapeIlikePattern(normalized);
  return columns.map((column) => `${column}.ilike.%${escaped}%`).join(",");
};
