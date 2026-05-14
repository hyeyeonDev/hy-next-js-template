import type { ContentKind, ContentStatus } from "@/types";

export const contentMeta = {
  notice: {
    title: "공지사항",
    description: "사용자에게 노출할 공지사항을 관리합니다.",
    path: "/boards/notices",
    createLabel: "공지 작성",
    allowReplies: false,
  },
  inquiry: {
    title: "질의",
    description: "사용자 문의와 처리 상태를 관리합니다.",
    path: "/boards/inquiries",
    createLabel: "질의 등록",
    allowReplies: true,
  },
  qna: {
    title: "Q&A",
    description: "자주 묻는 질문과 답변을 관리합니다.",
    path: "/boards/qna",
    createLabel: "Q&A 작성",
    allowReplies: true,
  },
} satisfies Record<
  ContentKind,
  { title: string; description: string; path: string; createLabel: string; allowReplies: boolean }
>;

export const statusLabel = {
  draft: "임시저장",
  published: "게시",
  answered: "답변완료",
  closed: "종료",
} satisfies Record<ContentStatus, string>;
