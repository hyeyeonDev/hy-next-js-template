"use client";

import { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({
  children,
  required,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-text", className)}
      {...props}
    >
      {children}

      {required && <span className="ml-0.5 text-danger-600">*</span>}
    </label>
  );
}
