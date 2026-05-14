"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Drawer({ open, onClose, title, children, side = "right", className }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="닫기" />
      <aside
        className={cn(
          "absolute top-0 h-full w-80 max-w-[85vw] bg-surface shadow-xl",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold text-text">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-surface-2" aria-label="닫기">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </aside>
    </div>
  );
}
