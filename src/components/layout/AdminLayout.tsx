"use client";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}
