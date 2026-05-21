import { getI18nStorage, isLocaleCode, normalizeLocaleCode } from "@/lib/i18n-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const code = normalizeLocaleCode(locale);

  if (!isLocaleCode(code)) {
    return Response.json({ message: "언어 코드가 올바르지 않습니다." }, { status: 400 });
  }

  const storage = getI18nStorage();
  return Response.json(await storage.getDictionary(code));
}

