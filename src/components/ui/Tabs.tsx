"use client";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsCtx { active: string; setActive: (v: string) => void }
const TabsContext = createContext<TabsCtx>({ active: "", setActive: () => {} });

interface TabsProps { defaultValue: string; children: React.ReactNode; className?: string }
export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex border-b border-border", className)}>
      {children}
    </div>
  );
}

export function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
        isActive
          ? "border-primary-500 text-primary-600 dark:text-primary-400"
          : "border-transparent text-text-muted hover:text-text hover:border-gray-300"
      )}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className="pt-4">{children}</div>;
}
