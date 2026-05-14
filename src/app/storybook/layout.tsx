"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  CircleUserRound,
  FileText,
  FormInput,
  KeyRound,
  Layers,
  MessageSquare,
  MessagesSquare,
  Moon,
  Navigation,
  Palette,
  PanelTop,
  Square,
  Sun,
  Table,
  Tag,
  ToggleLeft,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const sections: Array<{ id: string; label: string; Icon: LucideIcon }> = [
  { id: "colors", label: "Color Palette", Icon: Palette },
  { id: "darkmode", label: "Dark Mode", Icon: Moon },
  { id: "typography", label: "Typography", Icon: Type },
  { id: "layout", label: "Layout", Icon: Layers },
  { id: "buttons", label: "Button", Icon: Square },
  { id: "badges", label: "Badge", Icon: Tag },
  { id: "avatars", label: "Avatar", Icon: CircleUserRound },
  { id: "cards", label: "Card", Icon: PanelTop },
  { id: "interactive", label: "Switch / Tabs", Icon: ToggleLeft },
  { id: "advanced-components", label: "Advanced", Icon: Boxes },
  { id: "misc", label: "Tooltip / Spinner", Icon: MessageSquare },
  { id: "forms", label: "Forms", Icon: FormInput },
  { id: "charts", label: "Charts", Icon: BarChart3 },
  { id: "alert", label: "Alert", Icon: Bell },
  { id: "navigation", label: "Navigation", Icon: Navigation },
  { id: "data-display", label: "Data Display", Icon: Table },
  { id: "api-mock", label: "API Mock", Icon: FileText },
  { id: "modal", label: "Modal", Icon: PanelTop },
  { id: "toast", label: "Toast / Snackbar", Icon: MessagesSquare },
  { id: "dialog", label: "Dialog", Icon: MessageSquare },
];

export default function StorybookLayout({ children }: { children: React.ReactNode }) {
  const { toggle, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSection(hash);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (current?.target.id) {
          setActiveSection(current.target.id);
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0.1, 0.35, 0.65, 1] },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="sticky top-0 h-screen w-52 shrink-0 border-r border-border bg-surface overflow-y-auto">
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          <span className="text-sm font-bold text-text">Components</span>
          <button
            onClick={toggle}
            className="rounded-md p-1 text-text-muted hover:bg-surface-2 hover:text-text"
            title="다크모드 토글"
            aria-label="다크모드 토글"
          >
            {isDark ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <nav className="p-2">
          {sections.map(({ Icon, ...s }) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={activeSection === s.id ? "location" : undefined}
              className={cn(
                "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-surface-2 hover:text-text",
                activeSection === s.id &&
                  "bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-300",
              )}
            >
              {activeSection === s.id && (
                <span className="absolute left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary-500" />
              )}
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {s.label}
            </a>
          ))}
          <div className="my-2 border-t border-border" />
          <Link href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            샘플 대시보드
          </Link>
          <Link href="/error-preview"
            className="mt-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-danger-600 hover:bg-danger-50 transition-colors">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            에러 페이지 보기
          </Link>
          <Link href={ROUTES.AUTH.LOGIN}
            className="mt-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-text-muted hover:bg-surface-2 hover:text-text transition-colors">
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
            로그인 / 회원가입
          </Link>
        </nav>
      </aside>
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-surface px-8 py-4">
          <h1 className="text-xl font-bold text-text">컴포넌트 쇼케이스</h1>
          <p className="mt-0.5 text-sm text-text-muted">디자이너와 공유하는 컴포넌트 미리보기 페이지입니다.</p>
        </div>
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
