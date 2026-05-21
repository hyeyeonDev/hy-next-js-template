"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_LOCALE,
  DEFAULT_LOCALE_OPTIONS,
  dictionaries,
  type Locale,
  type LocaleOption,
  type TranslationKey,
} from "./dictionaries";

const STORAGE_KEY = "dgis-locale";
type Dictionary = Record<TranslationKey, string>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: LocaleOption[];
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocaleCode(value: string | null): value is Locale {
  return !!value && /^[A-Z]{2,3}$/.test(value);
}

function normalizeLocaleCode(value: string | null) {
  return value?.trim().toUpperCase() ?? "";
}

function isDictionary(value: unknown): value is Partial<Dictionary> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseLocaleOptions(value: unknown): LocaleOption[] | null {
  if (!Array.isArray(value)) return null;

  const options = value.flatMap((item) => {
    if (typeof item === "string") {
      const code = normalizeLocaleCode(item);
      if (!isLocaleCode(code)) return [];
      return [{ code, label: code }];
    }

    const code =
      typeof item === "object" && item !== null && "code" in item && typeof item.code === "string"
        ? normalizeLocaleCode(item.code)
        : "";

    if (
      typeof item === "object" &&
      item !== null &&
      isLocaleCode(code)
    ) {
      return [
        {
          code,
          label: "label" in item && typeof item.label === "string" ? item.label : code,
        },
      ];
    }

    return [];
  });

  return options.length > 0 ? options : null;
}

function getInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = normalizeLocaleCode(window.localStorage.getItem(STORAGE_KEY));
  if (isLocaleCode(stored)) {
    return stored;
  }

  const browserLocale = window.navigator.language.split("-")[0]?.toUpperCase();
  return browserLocale && dictionaries[browserLocale] ? browserLocale : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [availableLocales, setAvailableLocales] = useState<LocaleOption[]>(DEFAULT_LOCALE_OPTIONS);
  const [uploadedDictionaries, setUploadedDictionaries] = useState<Record<Locale, Partial<Dictionary>>>({});

  useEffect(() => {
    document.documentElement.lang = locale.toLowerCase();
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLocales() {
      try {
        const response = await fetch("/api/i18n", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = await response.json();
        const options = parseLocaleOptions(data?.locales);
        if (!options) return;

        setAvailableLocales(options);
        if (!options.some((option) => option.code === locale)) {
          setLocaleState(DEFAULT_LOCALE);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.warn("Failed to load locale list", error);
        }
      }
    }

    loadLocales();

    return () => controller.abort();
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDictionary() {
      try {
        const response = await fetch(`/api/i18n/${locale}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const dictionary = await response.json();
        if (!isDictionary(dictionary)) return;

        setUploadedDictionaries((current) => ({
          ...current,
          [locale]: dictionary,
        }));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.warn(`Failed to load locale file: ${locale}`, error);
        }
      }
    }

    loadDictionary();

    return () => controller.abort();
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      availableLocales,
      t: (key) => uploadedDictionaries[locale]?.[key] ?? dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key,
    }),
    [availableLocales, locale, uploadedDictionaries],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
