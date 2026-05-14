"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";

import { Eye, EyeOff, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/Input";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        leftIcon={<Lock aria-hidden="true" />}
        rightIcon={
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className={cn("text-text-subtle transition-colors hover:text-text-muted")}
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          {show ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
        }
        className={className}
        {...props}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";
