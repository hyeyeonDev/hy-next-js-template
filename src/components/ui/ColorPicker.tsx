"use client";

import { Input } from "./Input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-10 cursor-pointer rounded-md border border-border bg-surface"
        aria-label={label ?? "색상 선택"}
      />
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="w-28 font-mono" />
    </label>
  );
}
