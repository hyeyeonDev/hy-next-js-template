"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Link } from "lucide-react";

import { Input } from "@/components/ui/Input";

export const UrlField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      type="url"
      inputMode="url"
      autoComplete="url"
      placeholder="https://example.com"
      leftIcon={<Link aria-hidden="true" />}
      className={className}
      {...props}
    />
  );
});

UrlField.displayName = "UrlField";
