import { env } from "./env";

export const FEATURE_KEYS = {
  DASHBOARD: "dashboard",
  MY_PAGE: "mypage",
  USER_PERMISSIONS: "user-permissions",
  LOGIN_HISTORY: "login-history",
  ORGANIZATIONS: "organizations",
  DATA_CODES: "data-codes",
  NOTICES: "notices",
  INQUIRIES: "inquiries",
  QNA: "qna",
  STORYBOOK: "storybook",
  ERROR_PREVIEW: "error-preview",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];

const LOCAL_ENV_NAMES = new Set(["local", "development"]);

const FEATURE_ROUTES: Array<{ key: FeatureKey; paths: string[] }> = [
  { key: FEATURE_KEYS.LOGIN_HISTORY, paths: ["/users/login-history"] },
  { key: FEATURE_KEYS.USER_PERMISSIONS, paths: ["/users"] },
  { key: FEATURE_KEYS.ORGANIZATIONS, paths: ["/organizations"] },
  { key: FEATURE_KEYS.DATA_CODES, paths: ["/data/codes"] },
  { key: FEATURE_KEYS.NOTICES, paths: ["/boards/notices"] },
  { key: FEATURE_KEYS.INQUIRIES, paths: ["/boards/inquiries"] },
  { key: FEATURE_KEYS.QNA, paths: ["/boards/qna"] },
  { key: FEATURE_KEYS.DASHBOARD, paths: ["/dashboard"] },
  { key: FEATURE_KEYS.MY_PAGE, paths: ["/mypage"] },
  { key: FEATURE_KEYS.STORYBOOK, paths: ["/storybook"] },
  { key: FEATURE_KEYS.ERROR_PREVIEW, paths: ["/error-preview"] },
];

const BOARD_FEATURES = [FEATURE_KEYS.NOTICES, FEATURE_KEYS.INQUIRIES, FEATURE_KEYS.QNA] as const;

function createFeatureSet(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function getPublicEnabledFeatureSet() {
  return createFeatureSet(env.NEXT_PUBLIC_ENABLED_FEATURES);
}

function getServerEnabledFeatureSet() {
  return createFeatureSet(env.APP_ENABLED_FEATURES || env.NEXT_PUBLIC_ENABLED_FEATURES);
}

export function isLocalFeatureMode() {
  return env.isDev || LOCAL_ENV_NAMES.has(env.APP_ENV);
}

/**
 * 클라이언트 UI 숨김 처리 기준입니다.
 * 사이드바/대시보드 바로가기처럼 "보여줄지 말지" 결정하는 곳에서 사용하세요.
 */
export function isFeatureEnabled(key: FeatureKey) {
  if (isLocalFeatureMode()) return true;
  return getPublicEnabledFeatureSet().has(key);
}

/**
 * 서버 접근 제어 기준입니다.
 * 브라우저에 노출되지 않는 APP_ENABLED_FEATURES를 우선 사용합니다.
 */
function isServerFeatureEnabled(key: FeatureKey) {
  if (isLocalFeatureMode()) return true;
  return getServerEnabledFeatureSet().has(key);
}

/**
 * 직접 URL 접근 차단 기준입니다.
 * src/proxy.ts에서 호출하며, false면 404를 반환합니다.
 */
export function isRouteFeatureEnabled(pathname: string) {
  if (isLocalFeatureMode()) return true;

  if (pathname === "/boards") {
    return BOARD_FEATURES.some((key) => isServerFeatureEnabled(key));
  }

  const matched = FEATURE_ROUTES
    .flatMap(({ key, paths }) => paths.map((path) => ({ key, path })))
    .filter(({ path }) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];

  return matched ? isServerFeatureEnabled(matched.key) : true;
}

/** /boards 진입 시 접근 가능한 첫 게시판 메뉴로 보냅니다. */
export function getFirstEnabledBoardPath() {
  if (isServerFeatureEnabled(FEATURE_KEYS.NOTICES)) return "/boards/notices";
  if (isServerFeatureEnabled(FEATURE_KEYS.INQUIRIES)) return "/boards/inquiries";
  if (isServerFeatureEnabled(FEATURE_KEYS.QNA)) return "/boards/qna";
  return null;
}
