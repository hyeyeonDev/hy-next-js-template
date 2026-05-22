import type {
  ContentItem,
  ContentKind,
  ContentListParams,
  CreateContentDto,
  UpdateContentDto,
} from "@/types/content";

import { fail, getId, ok, page, type MockRequest } from "../mock-utils";
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

function listContents(kind: ContentKind, params: ContentListParams = {}) {
  const search = params.search?.trim().toLowerCase();
  const filtered = mockStore.contents
    .filter((item) => item.kind === kind)
    .filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.content.toLowerCase().includes(search) ||
        item.authorName.toLowerCase().includes(search);
      const matchesStatus = !params.status || item.status === params.status;
      const matchesCategory = !params.category || item.category === params.category;
      const matchesAuthor = params.authorId === undefined || item.authorId === Number(params.authorId);

      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
    })
    .sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned) || b.id - a.id);

  return page(filtered, params);
}

function createContent(kind: ContentKind, dto: CreateContentDto) {
  const now = new Date().toISOString();
  const next: ContentItem = {
    id: Math.max(0, ...mockStore.contents.map((item) => item.id)) + 1,
    kind,
    title: dto.title,
    content: dto.content,
    authorId: mockStore.currentUser.id,
    authorName: mockStore.currentUser.name,
    status: dto.status ?? "published",
    category: dto.category,
    isPinned: dto.isPinned ?? false,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.contents = [next, ...mockStore.contents];
  return ok(next, "게시물이 생성되었습니다.");
}

function updateContent(kind: ContentKind, id: number, dto: UpdateContentDto) {
  const target = mockStore.contents.find((item) => item.kind === kind && item.id === id);
  if (!target) fail(404, "게시물을 찾을 수 없습니다.");
  if (target.authorId !== mockStore.currentUser.id && !isAdminRole(mockStore.currentUser.role)) {
    fail(403, "게시물 수정 권한이 없습니다.");
  }

  const updated = { ...target, ...dto, updatedAt: new Date().toISOString() };
  mockStore.contents = mockStore.contents.map((item) => (item.id === id ? updated : item));
  return ok(updated, "게시물이 수정되었습니다.");
}

function deleteContent(kind: ContentKind, id: number) {
  const target = mockStore.contents.find((item) => item.kind === kind && item.id === id);
  if (!target) fail(404, "게시물을 찾을 수 없습니다.");
  if (target.authorId !== mockStore.currentUser.id && !isAdminRole(mockStore.currentUser.role)) {
    fail(403, "게시물 삭제 권한이 없습니다.");
  }

  mockStore.contents = mockStore.contents.filter((item) => !(item.kind === kind && item.id === id));
  return ok(null, "게시물이 삭제되었습니다.");
}

export function handleContentMock({ method, path, params, body }: MockRequest) {
  const kind = getContentKind(path);
  if (!kind) return undefined;

  const basePath = getContentPrefix(kind).slice(0, -1);

  if (path === basePath) {
    if (method === "GET") {
      return listContents(kind, params as ContentListParams);
    }

    if (method === "POST") {
      return createContent(kind, body as CreateContentDto);
    }
  }

  if (!path.startsWith(getContentPrefix(kind))) {
    return undefined;
  }

  const id = getId(path, getContentPrefix(kind));
  if (!id) fail(400, "잘못된 게시물 ID입니다.");

  if (method === "GET") {
    const content = mockStore.contents.find((item) => item.kind === kind && item.id === id);
    if (!content) fail(404, "게시물을 찾을 수 없습니다.");
    return ok({ ...content, viewCount: content.viewCount + 1 });
  }

  if (method === "PATCH") {
    return updateContent(kind, id, body as UpdateContentDto);
  }

  if (method === "DELETE") {
    return deleteContent(kind, id);
  }

  return undefined;
}
