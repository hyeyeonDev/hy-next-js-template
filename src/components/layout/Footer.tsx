import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function Footer({ children, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-border bg-surface px-6 py-4 text-xs text-text-muted", className)}>
      {children ?? <p>© {new Date().getFullYear()} {env.APP_NAME}. All rights reserved.</p>}
    </footer>
  );
}
