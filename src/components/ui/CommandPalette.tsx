"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "./Input";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-start justify-center bg-black/40 px-4 pt-[12vh]">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
        <div className="border-b border-border p-3">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            leftIcon={<Search aria-hidden="true" />}
            placeholder="명령어 검색"
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
            }}
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onSelect();
                onClose();
              }}
              className="block w-full rounded-md px-3 py-2 text-left hover:bg-surface-2"
            >
              <span className="block text-sm font-medium text-text">{item.label}</span>
              {item.description && <span className="text-xs text-text-muted">{item.description}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
