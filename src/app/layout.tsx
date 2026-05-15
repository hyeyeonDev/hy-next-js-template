import type { Metadata } from "next";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { DialogProvider } from "@/components/ui/dialog";
import { ReactQueryProvider } from "@/lib/react-query";
import { I18nProvider } from "@/i18n";

export const metadata: Metadata = {
  title: "프로젝트 템플릿",
  description: "Next.js 프로젝트 템플릿",
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
  } catch {
    document.documentElement.classList.remove("dark");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ReactQueryProvider>
          <I18nProvider>
            <ToastProvider>
              <DialogProvider>{children}</DialogProvider>
            </ToastProvider>
          </I18nProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
