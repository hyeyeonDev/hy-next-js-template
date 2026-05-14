/** 공통 메시지 상수 */
export const MSG = {
  SUCCESS: {
    SAVE:   "저장되었습니다.",
    DELETE: "삭제되었습니다.",
    UPDATE: "수정되었습니다.",
    COPY:   "복사되었습니다.",
    SEND:   "전송되었습니다.",
  },
  ERROR: {
    UNKNOWN: "알 수 없는 오류가 발생했습니다.",
    NETWORK: "네트워크 오류가 발생했습니다.",
    AUTH:    "로그인이 필요합니다.",
    FORBIDDEN: "접근 권한이 없습니다.",
    NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
  },
  CONFIRM: {
    DELETE: "정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
    LEAVE:  "변경사항이 저장되지 않을 수 있습니다. 나가시겠습니까?",
  },
  EMPTY: {
    DEFAULT: "데이터가 없습니다.",
    SEARCH:  "검색 결과가 없습니다.",
  },
} as const;
