import { getI18nStorage } from "@/lib/i18n-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const storage = getI18nStorage();
  return Response.json({ locales: await storage.listLocales() });
}

