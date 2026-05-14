"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Mail } from "lucide-react";

import { Input } from "@/components/ui/Input";

export const EmailField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="email"
      inputMode="email"
      autoComplete="email"
      placeholder="example@email.com"
      leftIcon={<Mail aria-hidden="true" />}
      className={className}
      {...props}
    />
  );
});

EmailField.displayName = "EmailField";
