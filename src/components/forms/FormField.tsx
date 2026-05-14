"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  required,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      {children}

      {!error && hint && <p className="text-xs text-text-subtle">{hint}</p>}

      <FormError error={error} />
    </div>
  );
}
