"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileUploadFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  helperText?: string;
}

export const FileUploadField = forwardRef<HTMLInputElement, FileUploadFieldProps>(
  ({ className, helperText, ...props }, ref) => {
    return (
      <label
        className={cn(
          "flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface px-4 py-5 text-center transition-colors hover:bg-surface-2",
          className,
        )}
      >
        <Upload className="h-5 w-5 text-text-subtle" aria-hidden="true" />
        <span className="text-sm font-medium text-text">파일 선택</span>
        {helperText && <span className="text-xs text-text-subtle">{helperText}</span>}
        <input ref={ref} type="file" className="sr-only" {...props} />
      </label>
    );
  },
);

FileUploadField.displayName = "FileUploadField";
