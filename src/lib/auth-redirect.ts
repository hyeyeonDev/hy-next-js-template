import { ROUTES } from "@/constants/routes";

export function getSafeReturnPath(value?: string | string[] | null, fallback: string = ROUTES.DASHBOARD) {
  const next = Array.isArray(value) ? value[0] : value;

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}

export function createLoginPath(next?: string | null) {
  const path = ROUTES.AUTH.LOGIN;
  const safeNext = getSafeReturnPath(next, "");

  if (!safeNext) return path;

  return `${path}?next=${encodeURIComponent(safeNext)}`;
}
