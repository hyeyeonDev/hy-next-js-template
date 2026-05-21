export type Dictionary = Record<string, string>;

export interface LocaleOption {
  code: string;
  label: string;
}

export interface I18nStorage {
  listLocales(): Promise<LocaleOption[]>;
  listLocaleCodes(): Promise<string[]>;
  getDictionary(locale: string): Promise<Dictionary>;
  saveDictionary(locale: string, dictionary: Dictionary): Promise<void>;
  deleteDictionary(locale: string): Promise<void>;
  saveLocales(locales: LocaleOption[]): Promise<LocaleOption[]>;
}

