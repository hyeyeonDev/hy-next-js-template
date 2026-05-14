import type { ContentComment } from "@/types/content";

const now = "2026-05-13T09:00:00.000Z";

export const mockContentComments: ContentComment[] = [
  {
    id: 1,
    contentId: 1,
    authorId: 2,
    authorName: "이서연",
    content: "점검 시간 동안 예약 작업도 중지되는지 확인 부탁드립니다.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    contentId: 1,
    parentId: 1,
    authorId: 1,
    authorName: "관리자",
    content: "공지사항은 대댓글을 UI에서 막아두지만, mock 데이터로는 정책 테스트를 위해 남겨둔 예시입니다.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    contentId: 3,
    authorId: 3,
    authorName: "박도현",
    content: "권한 변경 범위가 운영 메뉴 전체인지 일부 메뉴인지 궁금합니다.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    contentId: 3,
    parentId: 3,
    authorId: 1,
    authorName: "관리자",
    content: "일단 사용자 관리와 게시판 관리 권한만 부여하는 방향으로 검토하겠습니다.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    contentId: 4,
    authorId: 4,
    authorName: "최유나",
    content: "실제 API 업로드 제한과 프론트 제한을 같이 문서화하면 좋겠습니다.",
    createdAt: now,
    updatedAt: now,
  },
];
