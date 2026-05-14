import { cn } from "@/lib/utils";

interface NavbarProps {
    logo?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export function Navbar({ logo, actions, className }: NavbarProps) {
    return (
        <header className={cn(
            "sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6",
            className
        )}>
            <div className="flex items-center gap-3">{logo}</div>
            <div className="flex items-center gap-2">{actions}</div>
        </header>
    );
}
