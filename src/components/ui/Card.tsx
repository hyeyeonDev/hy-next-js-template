import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  border?: boolean;
}

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const shadowStyles = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export function Card({
  children,
  className,
  padding = "md",
  shadow = "sm",
  border = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface",
        paddingStyles[padding],
        shadowStyles[shadow],
        border && "border border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={cn("mb-4 border-b border-border pb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardSectionProps) {
  return (
    <h3 className={cn("text-base font-semibold text-text", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: CardSectionProps) {
  return (
    <p className={cn("mt-1 text-sm text-text-muted", className)}>{children}</p>
  );
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={cn("mt-4 border-t border-border pt-4", className)}>
      {children}
    </div>
  );
}
