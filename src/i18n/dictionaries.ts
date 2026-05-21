import enDictionary from "../../public/locales/EN.json";
import koDictionary from "../../public/locales/KO.json";

export type Locale = string;
export interface LocaleOption {
  code: Locale;
  label: string;
}

export const DEFAULT_LOCALE = "KO";
export const DEFAULT_LOCALE_OPTIONS: LocaleOption[] = [
  { code: "KO", label: "KO" },
  { code: "EN", label: "EN" },
];
export type TranslationKey = keyof typeof koDictionary;

export const dictionaries: Record<
  Locale,
  Partial<Record<TranslationKey, string>>
> = {
  KO: koDictionary,
  EN: enDictionary,
};
