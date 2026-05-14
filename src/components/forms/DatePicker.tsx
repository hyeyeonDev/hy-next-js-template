"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/Input";

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        className={cn(className)}
        {...props}
      />
    );
  },
);

DatePicker.displayName = "DatePicker";
