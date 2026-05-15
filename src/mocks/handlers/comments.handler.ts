import type { ContentComment, ContentKind, CreateCommentDto, UpdateCommentDto } from "@/types/content";

import { fail, getId, ok, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";
import { isAdminRole } from "@/lib/roles";

function getContentKind(path: string): ContentKind | null {
  if (path.startsWith("/notices")) return "notice";
  if (path.startsWith("/inquiries")) return "inquiry";
  if (path.startsWith("/qnas")) return "qna";
  return null;
}

function getContentPrefix(kind: ContentKind) {
  const map = {
    notice: "/notices/",
    inquiry: "/inquiries/",
    qna: "/qnas/",
  } satisfies Record<ContentKind, string>;

  return map[kind];
}

function getCommentsBasePath(kind: ContentKind, contentId: number) {
  return `${getContentPrefix(kind)}${contentId}/comments`;
}

function buildCommentTree(contentId: number) {
  const comments = mockStore.comments.filter((comment) => comment.contentId === contentId);
  const parents = comments.filter((comment) => !comment.parentId);

  return parents.map((parent) => ({
    ...parent,
    replies: comments.filter((comment) => comment.parentId === parent.id),
  }));
}

function createComment(contentId: number, dto: CreateCommentDto, parentId?: number) {
  if (!dto.content?.trim()) {
    fail(400, "댓글 내용을 입력해주세요.");
  }

  if (parentId) {
    const parent = mockStore.comments.find((comment) => comment.id === parentId && comment.contentId === contentId);
    if (!parent) fail(404, "원댓글을 찾을 수 없습니다.");
  }

  const now = new Date().toISOString();
  const next: ContentComment = {
    id: Math.max(0, ...mockStore.comments.map((comment) => comment.id)) + 1,
    contentId,
    parentId,
    authorId: mockStore.currentUser.id,
    authorName: mockStore.currentUser.name,
    content: dto.content,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.comments = [...mockStore.comments, next];
  return ok(next, parentId ? "답글이 등록되었습니다." : "댓글이 등록되었습니다.");
}

function updateComment(commentId: number, dto: UpdateCommentDto) {
  const target = mockStore.comments.find((comment) => comment.id === commentId);
  if (!target) fail(404, "댓글을 찾을 수 없습니다.");
  if (target.authorId !== mockStore.currentUser.id && !isAdminRole(mockStore.currentUser.role)) {
    fail(403, "댓글 수정 권한이 없습니다.");
  }

  const updated = { ...target, content: dto.content, updatedAt: new Date().toISOString() };
  mockStore.comments = mockStore.comments.map((comment) => (comment.id === commentId ? updated : comment));
  return ok(updated, "댓글이 수정되었습니다.");
}

function deleteComment(commentId: number) {
  const target = mockStore.comments.find((comment) => comment.id === commentId);
  if (!target) fail(404, "댓글을 찾을 수 없습니다.");
  if (target.authorId !== mockStore.currentUser.id && !isAdminRole(mockStore.currentUser.role)) {
    fail(403, "댓글 삭제 권한이 없습니다.");
  }

  mockStore.comments = mockStore.comments.filter((comment) => comment.id !== commentId && comment.parentId !== commentId);
  return ok(null, "댓글이 삭제되었습니다.");
}

export function handleCommentsMock({ method, path, body }: MockRequest) {
  const kind = getContentKind(path);
  if (!kind || !path.includes("/comments")) return undefined;

  const contentId = getId(path, getContentPrefix(kind));
  if (!contentId) fail(400, "잘못된 게시물 ID입니다.");

  const basePath = getCommentsBasePath(kind, contentId);

  if (path === basePath) {
    if (method === "GET") return ok(buildCommentTree(contentId));
    if (method === "POST") return createComment(contentId, body as CreateCommentDto);
  }

  const commentPath = `${basePath}/`;
  if (!path.startsWith(commentPath)) return undefined;

  const commentId = getId(path, commentPath);
  if (!commentId) fail(400, "잘못된 댓글 ID입니다.");

  if (method === "POST" && path === `${commentPath}${commentId}/replies`) {
    return createComment(contentId, body as CreateCommentDto, commentId);
  }

  if (method === "PATCH" && path === `${commentPath}${commentId}`) {
    return updateComment(commentId, body as UpdateCommentDto);
  }

  if (method === "DELETE" && path === `${commentPath}${commentId}`) {
    return deleteComment(commentId);
  }

  return undefined;
}
