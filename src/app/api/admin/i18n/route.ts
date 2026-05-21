import { cookies } from "next/headers";

import {
  DEFAULT_LOCALE,
  getI18nStorage,
  isLocaleCode,
  normalizeDictionary,
  normalizeLocaleCode,
  type Dictionary,
} from "@/lib/i18n-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

async function isAuthorized() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("access_token")?.value);
}

async function getAdminI18nPayload() {
  const storage = getI18nStorage();
  const locales = await storage.listLocales();
  const localeCodes = await storage.listLocaleCodes();
  const dictionaries: Record<string, Dictionary> = {};

  await Promise.all(
    localeCodes.map(async (locale) => {
      dictionaries[locale] = await storage.getDictionary(locale);
    }),
  );

  const keys = Array.from(
    new Set(Object.values(dictionaries).flatMap((dictionary) => Object.keys(dictionary))),
  ).sort((a, b) => a.localeCompare(b));

  return { locales, dictionaries, keys };
}

export async function GET() {
  if (!(await isAuthorized())) {
    return json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  return json(await getAdminI18nPayload());
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const incomingDictionaries = normalizeDictionary("dictionary" in body ? body.dictionary : null)
    ? { [normalizeLocaleCode("locale" in body ? body.locale : "")]: normalizeDictionary(body.dictionary) as Dictionary }
    : "dictionaries" in body && typeof body.dictionaries === "object" && body.dictionaries !== null
      ? Object.fromEntries(
          Object.entries(body.dictionaries).flatMap(([locale, dictionary]) => {
            const normalizedLocale = normalizeLocaleCode(locale);
            const normalized = normalizeDictionary(dictionary);
            if (!isLocaleCode(normalizedLocale) || !normalized) return [];
            return [[normalizedLocale, normalized] as const];
          }),
        )
      : {};

  const entries = Object.entries(incomingDictionaries);
  if (entries.length === 0 || entries.some(([locale]) => !isLocaleCode(locale))) {
    return json({ message: "저장할 언어 코드 또는 번역 데이터가 올바르지 않습니다." }, { status: 400 });
  }

  const storage = getI18nStorage();
  await Promise.all(
    entries.map(async ([locale, dictionary]) => {
      const currentDictionary = await storage.getDictionary(locale);
      await storage.saveDictionary(locale, { ...currentDictionary, ...dictionary });
    }),
  );

  const currentLocales = await storage.listLocales();
  const nextLocales = await storage.saveLocales([
    ...currentLocales,
    ...entries.map(([locale]) => ({
      code: locale,
      label: locale,
    })),
  ]);

  return json({
    message: "번역 파일이 저장되었습니다.",
    locales: nextLocales,
    saved: entries.map(([locale, dictionary]) => ({ locale, keys: Object.keys(dictionary).length })),
  });
}

export async function DELETE(request: Request) {
  if (!(await isAuthorized())) {
    return json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const url = new URL(request.url);
  const locale = normalizeLocaleCode(url.searchParams.get("locale"));

  if (!isLocaleCode(locale)) {
    return json({ message: "언어 코드가 올바르지 않습니다." }, { status: 400 });
  }

  if (locale === DEFAULT_LOCALE) {
    return json({ message: "기본 언어는 삭제할 수 없습니다." }, { status: 400 });
  }

  const storage = getI18nStorage();
  const currentLocales = await storage.listLocales();
  const locales = await storage.saveLocales(currentLocales.filter((item) => item.code !== locale));
  await storage.deleteDictionary(locale);

  return json({ message: "언어가 삭제되었습니다.", locales });
}

