"use client";

import { Languages } from "lucide-react";

import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-border bg-surface p-1" aria-label={t("common.language")}>
      <Languages className="ml-1 h-4 w-4 text-text-subtle" aria-hidden="true" />
      {(["ko", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            "h-6 rounded px-2 text-xs font-medium transition-colors",
            locale === item ? "bg-primary-600 text-white" : "text-text-muted hover:bg-surface-2 hover:text-text",
          )}
          onClick={() => setLocale(item)}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
