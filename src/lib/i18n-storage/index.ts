import { env } from "@/lib/env";

import { FileI18nStorage } from "./file-storage";
import { S3I18nStorage } from "./s3-storage";
import type { I18nStorage } from "./types";

let storage: I18nStorage | null = null;

export function getI18nStorage() {
  if (!storage) {
    storage = env.I18N_STORAGE === "s3" ? new S3I18nStorage() : new FileI18nStorage();
  }

  return storage;
}

export * from "./shared";
export type { Dictionary, I18nStorage, LocaleOption } from "./types";

