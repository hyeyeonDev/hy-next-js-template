import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn("p-0", className)}>
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}
