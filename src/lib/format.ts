const DEFAULT_TIME_ZONE = "Asia/Seoul";

type LocaleCode = "ko-KR" | "en-US" | string;

function normalizeLocale(locale?: LocaleCode) {
  return locale === "EN" || locale === "en-US" ? "en-US" : "ko-KR";
}

export function formatDate(value?: string | number | Date, locale?: LocaleCode) {
  if (!value) return "-";

  return new Intl.DateTimeFormat(normalizeLocale(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: DEFAULT_TIME_ZONE,
  }).format(new Date(value));
}

export function formatDateTime(value?: string | number | Date, locale?: LocaleCode) {
  if (!value) return "-";

  return new Intl.DateTimeFormat(normalizeLocale(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: DEFAULT_TIME_ZONE,
  }).format(new Date(value));
}

export function formatNumber(value: number, locale?: LocaleCode) {
  return new Intl.NumberFormat(normalizeLocale(locale)).format(value);
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
