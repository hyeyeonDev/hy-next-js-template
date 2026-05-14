"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/Input";

export interface AutoCompleteOption {
  label: string;
  value: string;
}

interface AutoCompleteProps {
  options: AutoCompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutoCompleteOption) => void;
  placeholder?: string;
}

export function AutoComplete({ options, value, onChange, onSelect, placeholder }: AutoCompleteProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const inputValue = value ?? internalValue;
  const filtered = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 8),
    [inputValue, options],
  );

  const update = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div className="relative">
      <Input value={inputValue} onChange={(event) => update(event.target.value)} placeholder={placeholder} />
      {inputValue && filtered.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-border bg-surface p-1 shadow-lg">
          {filtered.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                update(option.label);
                onSelect?.(option);
              }}
              className="block w-full rounded px-3 py-2 text-left text-sm text-text hover:bg-surface-2"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
