"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onChange, onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        leftIcon={<Search aria-hidden="true" />}
        className={className}
        onChange={(event) => {
          onChange?.(event);
          onSearch?.(event.target.value);
        }}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
