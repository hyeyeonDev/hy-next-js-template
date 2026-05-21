import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCALES_DIR = path.join(process.cwd(), "public", "locales");
const LOCALES_MANIFEST = path.join(LOCALES_DIR, "locales.json");

function usage() {
  console.log(`
Usage:
  npm run i18n:import -- --input ./translations/JA.json --locale JA --label JA
  npm run i18n:import -- --input ./translations/messages.csv

Supported input:
  JSON: flat key/value object, writes one locale file.
  CSV: header row with "key" plus locale columns such as KO,EN,JA.
       If --locale is provided, the script also accepts "value" or "translation" as the value column.
`);
}

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted && char === '"' && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && char === ",") {
      row.push(value);
      value = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((item) => item.some((cell) => cell.trim().length > 0));
}

function normalizeLocale(value) {
  const normalized = value?.trim().toUpperCase();
  if (!normalized || !/^[A-Z]{2,3}$/.test(normalized)) {
    throw new Error(`Invalid locale code: ${value ?? "(empty)"}`);
  }

  return normalized;
}

function assertFlatDictionary(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("JSON input must be an object.");
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, text]) => {
      if (typeof text !== "string") return [];
      return [[key, text]];
    }),
  );
}

function dictionaryFromCsv(text, requestedLocale) {
  const [header, ...rows] = parseCsv(text);
  if (!header) throw new Error("CSV input is empty.");

  const columns = header.map((cell) => cell.trim());
  const keyIndex = columns.indexOf("key");
  if (keyIndex < 0) throw new Error('CSV input must include a "key" column.');

  const localeColumns = new Map();
  if (requestedLocale) {
    const valueIndex = columns.findIndex((name) => [requestedLocale, "value", "translation"].includes(name));
    if (valueIndex < 0) {
      throw new Error(`CSV input must include "${requestedLocale}", "value", or "translation" column.`);
    }
    localeColumns.set(requestedLocale, valueIndex);
  } else {
    columns.forEach((name, index) => {
      const normalizedName = name.toUpperCase();
      if (index !== keyIndex && /^[A-Z]{2,3}$/.test(normalizedName)) {
        localeColumns.set(normalizedName, index);
      }
    });
  }

  if (localeColumns.size === 0) {
    throw new Error("CSV input must include at least one locale column, such as KO,EN,JA.");
  }

  const result = new Map(Array.from(localeColumns.keys()).map((locale) => [locale, {}]));

  rows.forEach((row) => {
    const key = row[keyIndex]?.trim();
    if (!key) return;

    localeColumns.forEach((index, locale) => {
      const text = row[index]?.trim();
      if (text) result.get(locale)[key] = text;
    });
  });

  return result;
}

async function readManifest() {
  try {
    const manifest = JSON.parse(await readFile(LOCALES_MANIFEST, "utf8"));
    if (!Array.isArray(manifest)) return [];
    return manifest.filter((item) => item && typeof item.code === "string");
  } catch {
    return [];
  }
}

async function writeDictionary(locale, dictionary) {
  const file = path.join(LOCALES_DIR, `${locale}.json`);
  await writeFile(file, `${JSON.stringify(dictionary, null, 2)}\n`, "utf8");
}

async function updateManifest(locales, label) {
  const manifest = await readManifest();
  const byCode = new Map(manifest.map((item) => [item.code, item]));
  const requestedLocale = getArg("locale") ? normalizeLocale(getArg("locale")) : undefined;

  locales.forEach((locale) => {
    byCode.set(locale, {
      code: locale,
      label: locale === requestedLocale && label ? label : byCode.get(locale)?.label ?? locale,
    });
  });

  const next = Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code));
  await writeFile(LOCALES_MANIFEST, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

async function main() {
  const input = getArg("input");
  const requestedLocale = getArg("locale") ? normalizeLocale(getArg("locale")) : undefined;
  const label = getArg("label");

  if (process.argv.includes("--help")) {
    usage();
    process.exit(0);
  }

  if (!input) {
    usage();
    process.exit(1);
  }

  await mkdir(LOCALES_DIR, { recursive: true });

  const inputPath = path.resolve(input);
  const ext = path.extname(inputPath).toLowerCase();
  const text = await readFile(inputPath, "utf8");

  if (ext === ".json") {
    const locale = normalizeLocale(requestedLocale ?? path.basename(inputPath, ext));
    const dictionary = assertFlatDictionary(JSON.parse(text));
    await writeDictionary(locale, dictionary);
    await updateManifest([locale], label);
    console.log(`Imported ${locale}: ${Object.keys(dictionary).length} keys`);
    return;
  }

  if (ext === ".csv") {
    const dictionaries = dictionaryFromCsv(text, requestedLocale);
    await Promise.all(Array.from(dictionaries, ([locale, dictionary]) => writeDictionary(locale, dictionary)));
    await updateManifest(Array.from(dictionaries.keys()), label);
    Array.from(dictionaries).forEach(([locale, dictionary]) => {
      console.log(`Imported ${locale}: ${Object.keys(dictionary).length} keys`);
    });
    return;
  }

  throw new Error(`Unsupported file type: ${ext}. Use .json or .csv.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
