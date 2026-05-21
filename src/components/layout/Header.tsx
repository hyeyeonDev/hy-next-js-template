import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ children, title, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b border-border bg-surface px-6",
        className,
      )}
    >
      {children ?? (
        <>
          <div className="min-w-0">
            {typeof title === "string" ? (
              <h1 className="truncate text-base font-semibold text-text">
                {title}
              </h1>
            ) : (
              title
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </>
      )}
    </header>
  );
}

export const Topbar = Header;
