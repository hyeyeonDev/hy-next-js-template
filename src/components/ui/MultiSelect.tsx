"use client";

import { Check, ChevronDown } from "lucide-react";

import { Button } from "./Button";
import { Chip } from "./Chip";
import { Popover } from "./Popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = "선택" }: MultiSelectProps) {
  const selected = options.filter((option) => value.includes(option.value));

  const toggle = (nextValue: string) => {
    onChange(value.includes(nextValue) ? value.filter((item) => item !== nextValue) : [...value, nextValue]);
  };

  return (
    <Popover
      trigger={
        <Button variant="outline" rightIcon={<ChevronDown aria-hidden="true" />} className="min-w-48 justify-between">
          {selected.length > 0 ? `${selected.length}개 선택` : placeholder}
        </Button>
      }
    >
      <div className="mb-2 flex flex-wrap gap-1">
        {selected.map((item) => (
          <Chip key={item.value} onRemove={() => toggle(item.value)}>
            {item.label}
          </Chip>
        ))}
      </div>
      <div className="flex max-h-56 flex-col overflow-y-auto">
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => toggle(option.value)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-text hover:bg-surface-2 disabled:opacity-50"
            >
              {option.label}
              <Check className={cn("h-4 w-4", checked ? "opacity-100" : "opacity-0")} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </Popover>
  );
}
