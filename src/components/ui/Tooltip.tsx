"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: Placement;
  delay?: number;
}

const placementStyles: Record<Placement, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, children, placement = "top", delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { timer.current = setTimeout(() => setVisible(true), delay); };
  const hide = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setVisible(false);
  };

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <span
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md bg-text px-2.5 py-1.5 text-xs text-text-inverse shadow-lg",
            placementStyles[placement]
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
