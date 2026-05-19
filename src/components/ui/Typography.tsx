import { createElement, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TypographyVariant = "h1"|"h2"|"h3"|"h4"|"body"|"body-sm"|"caption"|"label"|"code";
interface TypographyProps { variant?: TypographyVariant; children: ReactNode; className?: string; as?: ElementType }

const styles: Record<TypographyVariant, string> = {
  "h1":      "text-3xl font-bold tracking-tight text-text",
  "h2":      "text-2xl font-semibold tracking-tight text-text",
  "h3":      "text-xl font-semibold text-text",
  "h4":      "text-base font-semibold text-text",
  "body":    "text-sm text-text",
  "body-sm": "text-xs text-text",
  "caption": "text-xs text-text-muted",
  "label":   "text-xs font-medium uppercase tracking-widest text-text-subtle",
  "code":    "font-mono text-sm bg-surface-2 px-1.5 py-0.5 rounded text-danger-600 dark:text-danger-400",
};

const defaultTags: Record<TypographyVariant, ElementType> = {
  "h1": "h1", "h2": "h2", "h3": "h3", "h4": "h4",
  "body": "p", "body-sm": "p", "caption": "span", "label": "span", "code": "code",
};

export function Typography({ variant = "body", children, className, as }: TypographyProps) {
  const Tag = as ?? defaultTags[variant];

  return createElement(Tag, { className: cn(styles[variant], className) }, children);
}
