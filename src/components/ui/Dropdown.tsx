"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "./Button";
import { Popover } from "./Popover";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  label: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function Dropdown({ label, items, align = "left" }: DropdownProps) {
  return (
    <Popover
      align={align}
      trigger={
        <Button variant="outline" rightIcon={<ChevronDown aria-hidden="true" />}>
          {label}
        </Button>
      }
    >
      <div className="flex flex-col gap-1">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            disabled={item.disabled}
            onClick={item.onClick}
            className={cn(
              "rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50",
              item.danger ? "text-danger-600" : "text-text",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </Popover>
  );
}
