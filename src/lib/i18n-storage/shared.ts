import type { Dictionary, LocaleOption } from "./types";

export const DEFAULT_LOCALE = "KO";
export const DEFAULT_LOCALES: LocaleOption[] = [
  { code: "KO", label: "KO" },
  { code: "EN", label: "EN" },
];

export const LOCALE_CODE_PATTERN = /^[A-Z]{2,3}$/;

export function normalizeLocaleCode(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export function isLocaleCode(value: unknown): value is string {
  return typeof value === "string" && LOCALE_CODE_PATTERN.test(value);
}

export function normalizeDictionary(value: unknown): Dictionary | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value).flatMap(([key, text]) => {
    if (!key.trim() || typeof text !== "string") return [];
    return [[key.trim(), text] as const];
  });

  return Object.fromEntries(entries);
}

export function normalizeLocales(locales: LocaleOption[]) {
  return Array.from(
    new Map(
      locales
        .map((item) => normalizeLocaleCode(item.code))
        .filter(isLocaleCode)
        .map((code) => [code, { code, label: code }]),
    ).values(),
  ).sort((a, b) => a.code.localeCompare(b.code));
}

