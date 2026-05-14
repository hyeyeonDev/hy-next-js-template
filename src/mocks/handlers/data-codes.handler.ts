import type { CreateDataCodeDto, DataCode, DataCodeListParams, UpdateDataCodeDto } from "@/types";

import { fail, getId, ok, page, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";

const levelOrder = { large: 0, medium: 1, small: 2 } satisfies Record<DataCode["level"], number>;

function listDataCodes(params: DataCodeListParams = {}) {
  const search = params.search?.trim().toLowerCase();
  const filtered = mockStore.dataCodes.filter((item) => {
    const matchesSearch =
      !search ||
      item.code.toLowerCase().includes(search) ||
      item.codeName.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search);
    const matchesLevel = !params.level || item.level === params.level;
    const matchesParent = params.parentCode === undefined || item.parentCode === params.parentCode;

    return matchesSearch && matchesLevel && matchesParent;
  });

  const sorted = [...filtered].sort((a, b) => {
    const levelDiff = levelOrder[a.level] - levelOrder[b.level];
    return levelDiff || a.sortOrder - b.sortOrder || a.code.localeCompare(b.code);
  });

  return page(sorted, params);
}

function checkDuplicate(code: string, excludeId?: number) {
  const normalizedCode = code.trim().toUpperCase();
  return ok({
    code: normalizedCode,
    exists: mockStore.dataCodes.some((item) => item.id !== excludeId && item.code === normalizedCode),
  });
}

function validateParent(dto: CreateDataCodeDto) {
  if (dto.level === "large" && dto.parentCode) {
    fail(400, "대분류는 상위 코드를 선택하지 않습니다.");
  }

  if (dto.level !== "large" && !dto.parentCode) {
    fail(400, "중분류 또는 소분류는 상위 분류를 선택해주세요.");
  }

  if (dto.level === "medium") {
    const parent = mockStore.dataCodes.find((item) => item.code === dto.parentCode && item.level === "large");
    if (!parent) fail(400, "대분류를 먼저 선택해주세요.");
  }

  if (dto.level === "small") {
    const parent = mockStore.dataCodes.find((item) => item.code === dto.parentCode && item.level === "medium");
    if (!parent) fail(400, "중분류를 먼저 선택해주세요.");
  }
}

function createDataCode(dto: CreateDataCodeDto) {
  const code = dto.code.trim().toUpperCase();
  const codeName = dto.codeName.trim();
  const sortOrder = Number(dto.sortOrder);

  if (!code || !codeName || !Number.isFinite(sortOrder)) {
    fail(400, "코드, 코드명, 순서를 입력해주세요.");
  }

  if (mockStore.dataCodes.some((item) => item.code === code)) {
    fail(409, "이미 등록된 코드입니다.");
  }

  validateParent({ ...dto, code });

  const now = new Date().toISOString();
  const next: DataCode = {
    id: Math.max(0, ...mockStore.dataCodes.map((item) => item.id)) + 1,
    level: dto.level,
    code,
    codeName,
    sortOrder,
    description: dto.description?.trim(),
    parentCode: dto.level === "large" ? undefined : dto.parentCode,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.dataCodes = [next, ...mockStore.dataCodes];
  return ok(next, "코드가 등록되었습니다.");
}

function updateDataCode(id: number, dto: UpdateDataCodeDto) {
  const target = mockStore.dataCodes.find((item) => item.id === id);
  if (!target) fail(404, "코드를 찾을 수 없습니다.");

  const nextLevel = dto.level ?? target.level;
  const nextCode = dto.code?.trim().toUpperCase() ?? target.code;
  const nextCodeName = dto.codeName?.trim() ?? target.codeName;
  const nextSortOrder = dto.sortOrder ?? target.sortOrder;

  if (!nextCode || !nextCodeName || !Number.isFinite(Number(nextSortOrder))) {
    fail(400, "코드, 코드명, 순서를 입력해주세요.");
  }

  if (mockStore.dataCodes.some((item) => item.id !== id && item.code === nextCode)) {
    fail(409, "이미 등록된 코드입니다.");
  }

  validateParent({
    level: nextLevel,
    code: nextCode,
    codeName: nextCodeName,
    sortOrder: Number(nextSortOrder),
    description: dto.description,
    parentCode: nextLevel === "large" ? undefined : dto.parentCode ?? target.parentCode,
  });

  const updated: DataCode = {
    ...target,
    level: nextLevel,
    code: nextCode,
    codeName: nextCodeName,
    description: dto.description?.trim(),
    parentCode: nextLevel === "large" ? undefined : dto.parentCode ?? target.parentCode,
    updatedAt: new Date().toISOString(),
  };

  mockStore.dataCodes = mockStore.dataCodes.map((item) => (item.id === id ? updated : item));
  return ok(updated, "코드가 수정되었습니다.");
}

export function handleDataCodesMock({ method, path, params, body }: MockRequest) {
  if (method === "GET" && path === "/data-codes/check") {
    const query = params as { code?: string; excludeId?: string | number } | undefined;
    const excludeId = query?.excludeId === undefined ? undefined : Number(query.excludeId);
    return checkDuplicate(String(query?.code ?? ""), Number.isFinite(excludeId) ? excludeId : undefined);
  }

  if (method === "GET" && path === "/data-codes") {
    return listDataCodes(params as DataCodeListParams);
  }

  if (method === "POST" && path === "/data-codes") {
    return createDataCode(body as CreateDataCodeDto);
  }

  if (method === "PATCH" && path.startsWith("/data-codes/")) {
    const id = getId(path, "/data-codes/");
    if (!id) fail(400, "잘못된 코드 ID입니다.");
    return updateDataCode(id, body as UpdateDataCodeDto);
  }

  return undefined;
}
