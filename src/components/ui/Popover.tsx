"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  triggerClassName?: string;
}

export function Popover({ trigger, children, align = "left", className, triggerClassName }: PopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <span
        role="button"
        tabIndex={0}
        className={cn("inline-flex", triggerClassName)}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        {trigger}
      </span>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="닫기"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute top-full z-50 mt-2 min-w-48 rounded-lg border border-border bg-surface p-2 shadow-xl",
              align === "right" ? "right-0" : "left-0",
              className,
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
