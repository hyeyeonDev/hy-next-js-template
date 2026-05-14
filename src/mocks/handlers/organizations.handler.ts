import type { CreateOrganizationDto, Organization, OrganizationListParams, UpdateOrganizationDto } from "@/types";

import { fail, getId, ok, page, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";

function listOrganizations(params: OrganizationListParams = {}) {
  const search = params.search?.trim().toLowerCase();
  const filtered = mockStore.organizations.filter((organization) => {
    const matchesSearch =
      !search ||
      organization.code.toLowerCase().includes(search) ||
      organization.name.toLowerCase().includes(search) ||
      organization.description?.toLowerCase().includes(search);
    const matchesActive = params.isActive === undefined || organization.isActive === params.isActive;

    return matchesSearch && matchesActive;
  });

  return page(filtered, params);
}

function createOrganization(dto: CreateOrganizationDto) {
  if (!dto.code.trim() || !dto.name.trim()) {
    fail(400, "조직코드와 조직명을 입력해주세요.");
  }

  if (mockStore.organizations.some((item) => item.code.toLowerCase() === dto.code.trim().toLowerCase())) {
    fail(409, "이미 등록된 조직코드입니다.");
  }

  const now = new Date().toISOString();
  const next: Organization = {
    id: Math.max(0, ...mockStore.organizations.map((item) => item.id)) + 1,
    code: dto.code.trim().toUpperCase(),
    name: dto.name.trim(),
    description: dto.description?.trim(),
    isActive: dto.isActive,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.organizations = [next, ...mockStore.organizations];
  return ok(next, "조직이 추가되었습니다.");
}

function updateOrganization(id: number, dto: UpdateOrganizationDto) {
  const target = mockStore.organizations.find((item) => item.id === id);
  if (!target) fail(404, "조직을 찾을 수 없습니다.");

  const nextCode = dto.code?.trim().toUpperCase() ?? target.code;
  const nextName = dto.name?.trim() ?? target.name;
  if (!nextCode || !nextName) {
    fail(400, "조직코드와 조직명을 입력해주세요.");
  }

  if (mockStore.organizations.some((item) => item.id !== id && item.code.toLowerCase() === nextCode.toLowerCase())) {
    fail(409, "이미 등록된 조직코드입니다.");
  }

  const updated: Organization = {
    ...target,
    code: nextCode,
    name: nextName,
    description: dto.description?.trim(),
    isActive: dto.isActive ?? target.isActive,
    updatedAt: new Date().toISOString(),
  };

  mockStore.organizations = mockStore.organizations.map((item) => (item.id === id ? updated : item));
  return ok(updated, "조직이 수정되었습니다.");
}

export function handleOrganizationsMock({ method, path, params, body }: MockRequest) {
  if (method === "GET" && path === "/organizations") {
    return listOrganizations(params as OrganizationListParams);
  }

  if (method === "POST" && path === "/organizations") {
    return createOrganization(body as CreateOrganizationDto);
  }

  if (path.startsWith("/organizations/") && method === "PATCH") {
    const id = getId(path, "/organizations/");
    if (!id) fail(400, "잘못된 조직 ID입니다.");
    return updateOrganization(id, body as UpdateOrganizationDto);
  }

  return undefined;
}
