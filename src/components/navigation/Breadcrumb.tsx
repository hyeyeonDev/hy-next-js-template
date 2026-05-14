import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem { label: string; href?: string }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-text-subtle">/</span>}
            {item.href && i < items.length - 1
              ? <Link href={item.href} className="text-text-muted hover:text-text transition-colors">{item.label}</Link>
              : <span className={cn(i === items.length - 1 ? "font-medium text-text" : "text-text-muted")}>{item.label}</span>
            }
          </li>
        ))}
      </ol>
    </nav>
  );
}

