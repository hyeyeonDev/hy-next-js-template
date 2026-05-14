import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  icon,
  className,
}: StatCardProps) {
  const trendColor = {
    up: "text-success-600",
    down: "text-danger-500",
    neutral: "text-text-muted",
  };
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-text-muted">{label}</p>
        {icon && <div className="text-text-subtle">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-bold text-text">{value}</p>
      {change && (
        <p className={cn("mt-1 text-xs font-medium", trendColor[trend])}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "─"} {change}
        </p>
      )}
    </div>
  );
}
