import { cn } from "@/lib/utils";

import { Sidebar, type SidebarItem } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: {
    logo?: React.ReactNode;
    items: SidebarItem[];
    footer?: React.ReactNode;
  };
  topbar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MainLayout({ children, sidebar, topbar, footer, className, contentClassName }: MainLayoutProps) {
  return (
    <div className={cn("flex min-h-screen bg-bg", className)}>
      {sidebar && <Sidebar logo={sidebar.logo} items={sidebar.items} footer={sidebar.footer} />}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <main className={cn("flex-1 p-6", contentClassName)}>{children}</main>
        {footer}
      </div>
    </div>
  );
}
