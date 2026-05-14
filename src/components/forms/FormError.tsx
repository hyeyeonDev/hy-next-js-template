"use client";

import { cn } from "@/lib/utils";

interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) {
    return null;
  }

  return <p className={cn("text-xs text-danger-600", className)}>{error}</p>;
}
