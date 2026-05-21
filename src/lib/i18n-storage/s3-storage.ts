import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "@/lib/env";

import { DEFAULT_LOCALES, isLocaleCode, normalizeDictionary, normalizeLocaleCode, normalizeLocales } from "./shared";
import type { Dictionary, I18nStorage, LocaleOption } from "./types";

function getS3Client() {
  return new S3Client({
    region: env.AWS_REGION,
  });
}

function requireBucket() {
  if (!env.I18N_S3_BUCKET) {
    throw new Error("I18N_S3_BUCKET is required when I18N_STORAGE=s3.");
  }

  return env.I18N_S3_BUCKET;
}

function objectKey(fileName: string) {
  const prefix = env.I18N_S3_PREFIX.replace(/^\/+|\/+$/g, "");
  return prefix ? `${prefix}/${fileName}` : fileName;
}

async function bodyToString(body: unknown) {
  if (!body || typeof body !== "object" || !("transformToString" in body)) {
    return "";
  }

  return (body as { transformToString: () => Promise<string> }).transformToString();
}

export class S3I18nStorage implements I18nStorage {
  private client = getS3Client();

  async listLocales() {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: requireBucket(),
          Key: objectKey("locales.json"),
        }),
      );
      return normalizeLocales(JSON.parse(await bodyToString(response.Body)) as LocaleOption[]);
    } catch {
      return DEFAULT_LOCALES;
    }
  }

  async listLocaleCodes() {
    const locales = await this.listLocales();
    const response = await this.client.send(
      new ListObjectsV2Command({
        Bucket: requireBucket(),
        Prefix: env.I18N_S3_PREFIX.replace(/^\/+|\/+$/g, ""),
      }),
    );

    const fileCodes =
      response.Contents?.flatMap((item) => {
        const key = item.Key?.split("/").pop() ?? "";
        if (!key.endsWith(".json") || key === "locales.json") return [];
        const code = normalizeLocaleCode(key.replace(/\.json$/, ""));
        return isLocaleCode(code) ? [code] : [];
      }) ?? [];

    return Array.from(new Set([...locales.map((item) => item.code), ...fileCodes])).sort((a, b) => a.localeCompare(b));
  }

  async getDictionary(locale: string) {
    const code = normalizeLocaleCode(locale);
    if (!isLocaleCode(code)) return {};

    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: requireBucket(),
          Key: objectKey(`${code}.json`),
        }),
      );
      return normalizeDictionary(JSON.parse(await bodyToString(response.Body))) ?? {};
    } catch {
      return {};
    }
  }

  async saveDictionary(locale: string, dictionary: Dictionary) {
    const code = normalizeLocaleCode(locale);
    if (!isLocaleCode(code)) return;

    await this.client.send(
      new PutObjectCommand({
        Bucket: requireBucket(),
        Key: objectKey(`${code}.json`),
        Body: `${JSON.stringify(dictionary, null, 2)}\n`,
        ContentType: "application/json; charset=utf-8",
      }),
    );
  }

  async deleteDictionary(locale: string) {
    const code = normalizeLocaleCode(locale);
    if (!isLocaleCode(code)) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: requireBucket(),
        Key: objectKey(`${code}.json`),
      }),
    );
  }

  async saveLocales(locales: LocaleOption[]) {
    const normalized = normalizeLocales(locales);
    await this.client.send(
      new PutObjectCommand({
        Bucket: requireBucket(),
        Key: objectKey("locales.json"),
        Body: `${JSON.stringify(normalized, null, 2)}\n`,
        ContentType: "application/json; charset=utf-8",
      }),
    );
    return normalized;
  }
}

