import { cn } from "@/lib/utils";

interface DividerProps {
  label?: React.ReactNode;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("border-border", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-text-subtle">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
