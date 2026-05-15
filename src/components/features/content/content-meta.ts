import type { ContentKind, ContentStatus } from "@/types";
import type { TranslationKey } from "@/i18n";

type Translator = (key: TranslationKey) => string;

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

export function getContentMeta(kind: ContentKind, t: Translator) {
  const meta = contentMeta[kind];
  const keyMap = {
    notice: {
      title: "content.notice.title",
      description: "content.notice.description",
      createLabel: "content.notice.create",
    },
    inquiry: {
      title: "content.inquiry.title",
      description: "content.inquiry.description",
      createLabel: "content.inquiry.create",
    },
    qna: {
      title: "content.qna.title",
      description: "content.qna.description",
      createLabel: "content.qna.create",
    },
  } satisfies Record<ContentKind, { title: TranslationKey; description: TranslationKey; createLabel: TranslationKey }>;

  return {
    ...meta,
    title: t(keyMap[kind].title),
    description: t(keyMap[kind].description),
    createLabel: t(keyMap[kind].createLabel),
  };
}

export function getContentStatusLabel(status: ContentStatus, t: Translator) {
  const keyMap = {
    draft: "content.status.draft",
    published: "content.status.published",
    answered: "content.status.answered",
    closed: "content.status.closed",
  } satisfies Record<ContentStatus, TranslationKey>;

  return t(keyMap[status]);
}
