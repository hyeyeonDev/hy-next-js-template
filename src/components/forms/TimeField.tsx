"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export const TimeField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <Input ref={ref} type="time" className={cn(className)} {...props} />
  );
});

TimeField.displayName = "TimeField";
