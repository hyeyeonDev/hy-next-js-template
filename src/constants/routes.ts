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
  BOARDS: "/boards",
  NOTICES: "/notices",
  INQUIRIES: "/inquiries",
  QNA: "/qna",

  USERS: {
    ROOT:   "/users",
    DETAIL: (id: number | string) => `/users/${id}`,
    EDIT:   (id: number | string) => `/users/${id}/edit`,
  },

  SETTINGS: {
    ROOT:    "/settings",
    PROFILE: "/settings/profile",
    TEAM:    "/settings/team",
  },
} as const;
