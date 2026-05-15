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

/**
 * dev/product에서 공개할 기능 목록입니다.
 * local 환경은 이 목록과 관계없이 전체 기능을 볼 수 있습니다.
 *
 * 개발 중인 페이지를 숨기려면 이 목록에서 빼두고,
 * 배포 가능한 상태가 되면 여기에 추가하세요.
 */
const RELEASED_FEATURES = new Set<FeatureKey>([
  FEATURE_KEYS.DASHBOARD,
  FEATURE_KEYS.MY_PAGE,
  FEATURE_KEYS.NOTICES,
  FEATURE_KEYS.INQUIRIES,
  FEATURE_KEYS.QNA,
]);

/**
 * 기능별로 차단할 라우트를 여기에 연결합니다.
 *
 * 새 페이지를 feature flag로 막고 싶으면:
 * 1. FEATURE_KEYS에 key를 추가합니다.
 * 2. FEATURE_ROUTE_RULES에 해당 key와 차단할 path prefix를 추가합니다.
 * 3. 배포할 준비가 되면 RELEASED_FEATURES에 key를 추가합니다.
 *
 * 예) /reports와 /reports/weekly를 reports 기능으로 묶고 싶다면
 * { key: FEATURE_KEYS.REPORTS, paths: ["/reports"] }
 */
const FEATURE_ROUTE_RULES: Array<{ key: FeatureKey; paths: string[] }> = [
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

/** /boards는 자체 페이지가 아니라 활성화된 하위 게시판으로 보내기 위한 묶음입니다. */
const BOARD_FEATURES = [
  FEATURE_KEYS.NOTICES,
  FEATURE_KEYS.INQUIRIES,
  FEATURE_KEYS.QNA,
] as const;

export function isLocalFeatureMode() {
  return env.APP_ENV === "local";
}

/**
 * UI 숨김 처리 기준입니다.
 * 사이드바/대시보드 바로가기처럼 "보여줄지 말지" 결정하는 곳에서 사용하세요.
 */
export function isFeatureEnabled(key: FeatureKey) {
  if (isLocalFeatureMode()) return true;
  return RELEASED_FEATURES.has(key);
}

/**
 * 직접 URL 접근 차단 기준입니다.
 * src/proxy.ts에서 호출하며, false면 404를 반환합니다.
 *
 * feature flag는 개발 중인 페이지 노출을 막는 릴리즈 스위치입니다.
 * 실제 사용자 권한은 AuthGuard/RoleGuard/API에서 별도로 검증하세요.
 */
export function isRouteFeatureEnabled(pathname: string) {
  if (isLocalFeatureMode()) return true;

  if (pathname === "/boards") {
    return BOARD_FEATURES.some((key) => isFeatureEnabled(key));
  }

  const matched = FEATURE_ROUTE_RULES.flatMap(({ key, paths }) =>
    paths.map((path) => ({ key, path })),
  )
    .filter(({ path }) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];

  return matched ? isFeatureEnabled(matched.key) : true;
}

/**
 * /boards 진입 시 접근 가능한 첫 게시판 메뉴로 보냅니다.
 */
export function getFirstEnabledBoardPath() {
  if (isFeatureEnabled(FEATURE_KEYS.NOTICES)) return "/boards/notices";
  if (isFeatureEnabled(FEATURE_KEYS.INQUIRIES)) return "/boards/inquiries";
  if (isFeatureEnabled(FEATURE_KEYS.QNA)) return "/boards/qna";
  return null;
}
