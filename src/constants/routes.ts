/** 앱 라우트 상수 — href를 하드코딩하지 말고 여기서 가져오세요 */
export const ROUTES = {
  ROOT:       "/",
  STORYBOOK:  "/storybook",

  AUTH: {
    LOGIN:    "/login",
    SIGNUP:   "/signup",
    LOGOUT:   "/logout",
    FIND_ID:  "/find-id",
    FIND_PASSWORD: "/find-password",
  },

  DASHBOARD: "/dashboard",
  DIGITAL_MAP: "/digital-map",
  MY_PAGE: "/mypage",
  MY_PROFILE: "/mypage/profile",
  ORGANIZATIONS: "/organizations",
  DATA_CODES: "/data/codes",
  BOARDS: "/boards",
  NOTICES: "/boards/notices",
  INQUIRIES: "/boards/inquiries",
  QNA: "/boards/qna",

  USERS: {
    ROOT:   "/users",
    LOGIN_HISTORY: "/users/login-history",
    DETAIL: (id: number | string) => `/users/${id}`,
    EDIT:   (id: number | string) => `/users/${id}/edit`,
  },

  SETTINGS: {
    ROOT:    "/settings",
    I18N:    "/settings/i18n",
    PROFILE: "/settings/profile",
    TEAM:    "/settings/team",
  },
} as const;
