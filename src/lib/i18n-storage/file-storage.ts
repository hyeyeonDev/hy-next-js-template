import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { env } from "@/lib/env";

import { DEFAULT_LOCALES, isLocaleCode, normalizeDictionary, normalizeLocaleCode, normalizeLocales } from "./shared";
import type { Dictionary, I18nStorage, LocaleOption } from "./types";

function localesDir() {
  return path.isAbsolute(env.I18N_LOCALES_DIR)
    ? env.I18N_LOCALES_DIR
    : path.join(/* turbopackIgnore: true */ process.cwd(), env.I18N_LOCALES_DIR);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export class FileI18nStorage implements I18nStorage {
  private get dir() {
    return localesDir();
  }

  private get manifestPath() {
    return path.join(this.dir, "locales.json");
  }

  async listLocales() {
    const manifest = await readJsonFile<LocaleOption[]>(this.manifestPath, DEFAULT_LOCALES);
    return normalizeLocales(manifest);
  }

  async listLocaleCodes() {
    await mkdir(this.dir, { recursive: true });
    const [locales, files] = await Promise.all([
      this.listLocales(),
      readdir(this.dir).catch(() => []),
    ]);

    return Array.from(
      new Set([
        ...locales.map((item) => item.code),
        ...files
          .filter((file) => file.endsWith(".json") && file !== "locales.json")
          .map((file) => normalizeLocaleCode(path.basename(file, ".json")))
          .filter(isLocaleCode),
      ]),
    ).sort((a, b) => a.localeCompare(b));
  }

  async getDictionary(locale: string) {
    const code = normalizeLocaleCode(locale);
    if (!isLocaleCode(code)) return {};

    const dictionary = await readJsonFile(path.join(this.dir, `${code}.json`), {});
    return normalizeDictionary(dictionary) ?? {};
  }

  async saveDictionary(locale: string, dictionary: Dictionary) {
    const code = normalizeLocaleCode(locale);
    if (!isLocaleCode(code)) return;

    await mkdir(this.dir, { recursive: true });
    await writeFile(path.join(this.dir, `${code}.json`), `${JSON.stringify(dictionary, null, 2)}\n`, "utf8");
  }

  async deleteDictionary(locale: string) {
    const code = normalizeLocaleCode(locale);
    if (!isLocaleCode(code)) return;

    await unlink(path.join(this.dir, `${code}.json`)).catch(() => {});
  }

  async saveLocales(locales: LocaleOption[]) {
    const normalized = normalizeLocales(locales);
    await mkdir(this.dir, { recursive: true });
    await writeFile(this.manifestPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
    return normalized;
  }
}
