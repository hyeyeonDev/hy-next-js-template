"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Hash } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface NumberFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  min?: number;
  max?: number;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="number"
        inputMode="numeric"
        leftIcon={<Hash aria-hidden="true" />}
        className={className}
        {...props}
      />
    );
  },
);

NumberField.displayName = "NumberField";
