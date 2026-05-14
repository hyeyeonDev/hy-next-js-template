"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}
interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  className,
}: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "divide-y divide-border rounded-lg border border-border bg-surface",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggle(item.id)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-text hover:bg-surface-2 transition-colors"
          >
            {item.title}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-text-muted transition-transform",
                open.has(item.id) && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
          {open.has(item.id) && (
            <div className="p-4 text-sm text-text-muted">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
