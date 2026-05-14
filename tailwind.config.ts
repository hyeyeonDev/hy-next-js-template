import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // CSS 변수와 연결 — 디자이너가 globals.css 변수만 바꾸면 전체 반영
                gray: {
                    50: "var(--color-gray-50)",
                    100: "var(--color-gray-100)",
                    200: "var(--color-gray-200)",
                    300: "var(--color-gray-300)",
                    400: "var(--color-gray-400)",
                    500: "var(--color-gray-500)",
                    600: "var(--color-gray-600)",
                    700: "var(--color-gray-700)",
                    800: "var(--color-gray-800)",
                    900: "var(--color-gray-900)",
                    950: "var(--color-gray-950)",
                },
                primary: {
                    50: "var(--color-primary-50)",
                    100: "var(--color-primary-100)",
                    200: "var(--color-primary-200)",
                    300: "var(--color-primary-300)",
                    400: "var(--color-primary-400)",
                    500: "var(--color-primary-500)",
                    600: "var(--color-primary-600)",
                    700: "var(--color-primary-700)",
                    800: "var(--color-primary-800)",
                    900: "var(--color-primary-900)",
                },
                success: {
                    50: "var(--color-success-50)",
                    100: "var(--color-success-100)",
                    500: "var(--color-success-500)",
                    600: "var(--color-success-600)",
                    700: "var(--color-success-700)",
                },
                warning: {
                    50: "var(--color-warning-50)",
                    100: "var(--color-warning-100)",
                    500: "var(--color-warning-500)",
                    600: "var(--color-warning-600)",
                    700: "var(--color-warning-700)",
                },
                danger: {
                    50: "var(--color-danger-50)",
                    100: "var(--color-danger-100)",
                    500: "var(--color-danger-500)",
                    600: "var(--color-danger-600)",
                    700: "var(--color-danger-700)",
                },
                info: {
                    50: "var(--color-info-50)",
                    100: "var(--color-info-100)",
                    500: "var(--color-info-500)",
                    600: "var(--color-info-600)",
                },
                // 시맨틱 서피스 토큰 → bg-surface, border-border 등으로 사용
                bg: "var(--color-bg)",
                surface: "var(--color-surface)",
                surface2: "var(--color-surface-2)",
                border: "var(--color-border)",
                "border-strong": "var(--color-border-strong)",
                text: "var(--color-text)",
                "text-muted": "var(--color-text-muted)",
                "text-subtle": "var(--color-text-subtle)",
                "text-inverse": "var(--color-text-inverse)",
            },
            borderRadius: {
                xs: "var(--radius-xs)",
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
                full: "var(--radius-full)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            transitionDuration: {
                fast: "150",
                normal: "200",
                slow: "300",
            },
        },
    },

    plugins: [],
};

export default config;