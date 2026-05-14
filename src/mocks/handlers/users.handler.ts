import type { CreateUserDto, UpdateUserDto, User, UserListParams } from "@/types/user";

import { fail, getId, ok, page, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";

function listUsers(params: UserListParams = {}) {
  const search = params.search?.trim().toLowerCase();
  const filtered = mockStore.users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);
    const matchesStatus = !params.status || user.status === params.status;

    return matchesSearch && matchesStatus;
  });

  return page(filtered, params);
}

function createUser(dto: CreateUserDto) {
  const now = new Date().toISOString();
  const next: User = {
    id: Math.max(0, ...mockStore.users.map((user) => user.id)) + 1,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  mockStore.users = [next, ...mockStore.users];
  return ok(next, "사용자가 생성되었습니다.");
}

function updateUser(id: number, dto: UpdateUserDto) {
  const target = mockStore.users.find((user) => user.id === id);
  if (!target) fail(404, "사용자를 찾을 수 없습니다.");

  const updated = { ...target, ...dto, updatedAt: new Date().toISOString() };
  mockStore.users = mockStore.users.map((user) => (user.id === id ? updated : user));
  if (mockStore.currentUser?.id === id) mockStore.currentUser = updated;

  return ok(updated, "사용자가 수정되었습니다.");
}

function deleteUser(id: number) {
  const exists = mockStore.users.some((user) => user.id === id);
  if (!exists) fail(404, "사용자를 찾을 수 없습니다.");

  mockStore.users = mockStore.users.filter((user) => user.id !== id);
  return ok(null, "사용자가 삭제되었습니다.");
}

export function handleUsersMock({ method, path, params, body }: MockRequest) {
  if (method === "GET" && path === "/users") {
    return listUsers(params as UserListParams);
  }

  if (method === "POST" && path === "/users") {
    return createUser(body as CreateUserDto);
  }

  if (!path.startsWith("/users/")) {
    return undefined;
  }

  const id = getId(path, "/users/");
  if (!id) fail(400, "잘못된 사용자 ID입니다.");

  if (method === "GET") {
    const user = mockStore.users.find((item) => item.id === id);
    if (!user) fail(404, "사용자를 찾을 수 없습니다.");
    return ok(user);
  }

  if (method === "PATCH") {
    return updateUser(id, body as UpdateUserDto);
  }

  if (method === "DELETE") {
    return deleteUser(id);
  }

  return undefined;
}
