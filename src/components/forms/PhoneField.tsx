"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Phone } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface PhoneFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        placeholder="010-0000-0000"
        leftIcon={<Phone aria-hidden="true" />}
        className={className}
        {...props}
      />
    );
  },
);

PhoneField.displayName = "PhoneField";
