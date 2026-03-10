const COMBINING_MARKS_REGEX = /[\u0300-\u036f]/g
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g
const WHITESPACE_REGEX = /\s+/g

export function normalizeKeywordText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(COMBINING_MARKS_REGEX, "")
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_REGEX, " ")
    .replace(WHITESPACE_REGEX, " ")
    .trim()
}

export function joinNormalizedKeywordParts(values: string[]): string {
  return values
    .map(normalizeKeywordText)
    .filter(Boolean)
    .join(" ")
    .replace(WHITESPACE_REGEX, " ")
    .trim()
}
