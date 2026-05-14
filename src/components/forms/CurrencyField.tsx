"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Wallet } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface CurrencyFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  currency?: string;
}

export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  ({ className, currency = "₩", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="number"
        inputMode="decimal"
        leftIcon={<Wallet aria-hidden="true" />}
        rightIcon={<span className="text-sm">{currency}</span>}
        className={className}
        {...props}
      />
    );
  },
);

CurrencyField.displayName = "CurrencyField";
