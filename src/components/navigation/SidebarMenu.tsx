import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarMenuItem {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    children?: SidebarMenuItem[];
}

export function SidebarMenu({ items, className }: { items: SidebarMenuItem[]; className?: string }) {
    const pathname = usePathname();
    return (
        <nav className={cn("space-y-0.5 p-2", className)}>
            {items.map(item => <SidebarMenuItemRow key={item.href} item={item} pathname={pathname} />)}
        </nav>
    );
}

function SidebarMenuItemRow({ item, pathname }: { item: SidebarMenuItem; pathname: string }) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                    ? "bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
            )}
        >
            {item.icon && <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-600 dark:text-primary-400" : "text-text-subtle")} />}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge !== undefined && (
                <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

