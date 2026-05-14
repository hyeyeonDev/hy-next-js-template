/**
 * 환경변수 중앙 관리
 * 여기서 한 번만 검증하고, 앱 전체에서 이 파일을 import해서 사용합니다.
 * process.env.XXX 를 직접 쓰지 마세요.
 */

function optionalEnv(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  /** 내부 백엔드 API URL (서버 전용 — 브라우저 노출 X) */
  API_BASE_URL: optionalEnv("API_BASE_URL", "http://localhost:8080/api"),

  /** 클라이언트에서 접근 가능한 API URL */
  NEXT_PUBLIC_API_BASE_URL: optionalEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8080/api"),

  /** mock API 사용 여부: 실제 API 연결 시 NEXT_PUBLIC_USE_MOCK_API=false */
  USE_MOCK_API: optionalEnv("NEXT_PUBLIC_USE_MOCK_API", "true") !== "false",

  /** 앱 이름 */
  APP_NAME: optionalEnv("NEXT_PUBLIC_APP_NAME", "My App"),

  /** 현재 환경 */
  APP_ENV: optionalEnv("NEXT_PUBLIC_APP_ENV", "development"),

  /** 카카오맵 키 (선택) */
  KAKAO_MAP_KEY: optionalEnv("NEXT_PUBLIC_KAKAO_MAP_KEY"),

  /** Google Analytics ID (선택) */
  GA_ID: optionalEnv("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID"),

  /** 개발 환경 여부 */
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
