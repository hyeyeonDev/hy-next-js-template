import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function PageWrapper({
  children,
  title,
  description,
  actions,
  breadcrumb,
  className,
  headerClassName,
}: PageWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {breadcrumb}
      {(title || description || actions) && (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", headerClassName)}>
          <div className="min-w-0">
            {title && (typeof title === "string" ? <h1 className="text-2xl font-bold text-text">{title}</h1> : title)}
            {description && (
              <p className="mt-1 text-sm text-text-muted">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
