import type { FindIdDto, FindPasswordDto, LoginDto, SignupDto, UpdateProfileDto } from "@/types/auth";
import type { User } from "@/types/user";

import { fail, ok, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) {
    return email;
  }

  const visible = name.slice(0, Math.min(3, name.length));
  return `${visible}${"*".repeat(Math.max(2, name.length - visible.length))}@${domain}`;
}

function login(body: unknown) {
  const { email } = body as LoginDto;
  const user = mockStore.users.find((item) => item.email === email) ?? mockStore.users[0];
  mockStore.currentUser = user;

  return ok({
    accessToken: "mock-access-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      birthDate: user.birthDate,
      phone: user.phone,
      address: user.address,
      addressDetail: user.addressDetail,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

function signup(body: unknown) {
  const dto = body as SignupDto;
  if (!dto.name || !dto.email || !dto.password) {
    fail(400, "이름, 이메일, 비밀번호를 입력해주세요.");
  }

  if (mockStore.users.some((user) => user.email === dto.email)) {
    fail(409, "이미 가입된 이메일입니다.");
  }

  const now = new Date().toISOString();
  const user: User = {
    id: Math.max(0, ...mockStore.users.map((item) => item.id)) + 1,
    name: dto.name,
    email: dto.email,
    role: "USER",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  mockStore.users = [user, ...mockStore.users];
  mockStore.currentUser = user;

  return ok({
    accessToken: "mock-access-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      birthDate: user.birthDate,
      phone: user.phone,
      address: user.address,
      addressDetail: user.addressDetail,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

function findId(body: unknown) {
  const dto = body as FindIdDto;
  if (!dto.name || !dto.phone) {
    fail(400, "이름과 휴대폰 번호를 입력해주세요.");
  }

  const user = mockStore.users.find((item) => item.name === dto.name) ?? mockStore.users[0];
  return ok({ maskedEmail: maskEmail(user.email) }, "가입된 아이디를 확인했습니다.");
}

function findPassword(body: unknown) {
  const dto = body as FindPasswordDto;
  if (!dto.email || !dto.name) {
    fail(400, "이름과 이메일을 입력해주세요.");
  }

  const user = mockStore.users.find((item) => item.email === dto.email);
  if (!user) {
    fail(404, "가입된 계정을 찾을 수 없습니다.");
  }

  return ok({
    requested: true,
    message: "비밀번호 재설정 안내를 이메일로 발송했습니다.",
  });
}

function updateMe(body: unknown) {
  const dto = body as UpdateProfileDto;
  if (!dto.name?.trim()) {
    fail(400, "이름을 입력해주세요.");
  }

  const updated = {
    ...mockStore.currentUser,
    name: dto.name.trim(),
    birthDate: dto.birthDate,
    phone: dto.phone,
    address: dto.address,
    addressDetail: dto.addressDetail,
    updatedAt: new Date().toISOString(),
  };

  mockStore.currentUser = updated;
  mockStore.users = mockStore.users.map((user) => (user.id === updated.id ? updated : user));

  return ok({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    status: updated.status,
    avatarUrl: updated.avatarUrl,
    birthDate: updated.birthDate,
    phone: updated.phone,
    address: updated.address,
    addressDetail: updated.addressDetail,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  }, "내 정보가 수정되었습니다.");
}

function withdrawMe() {
  const updated = {
    ...mockStore.currentUser,
    status: "withdrawn" as const,
    updatedAt: new Date().toISOString(),
  };

  mockStore.currentUser = updated;
  mockStore.users = mockStore.users.map((user) => (user.id === updated.id ? updated : user));

  return ok(null, "회원 탈퇴가 처리되었습니다.");
}

export function handleAuthMock({ method, path, body }: MockRequest) {
  if (method === "POST" && path === "/auth/login") {
    return login(body);
  }

  if (method === "POST" && path === "/auth/signup") {
    return signup(body);
  }

  if (method === "POST" && path === "/auth/logout") {
    return ok(null);
  }

  if (method === "POST" && path === "/auth/find-id") {
    return findId(body);
  }

  if (method === "POST" && path === "/auth/find-password") {
    return findPassword(body);
  }

  if (method === "GET" && path === "/auth/me") {
    return ok({
      id: mockStore.currentUser.id,
      name: mockStore.currentUser.name,
      email: mockStore.currentUser.email,
      role: mockStore.currentUser.role,
      status: mockStore.currentUser.status,
      avatarUrl: mockStore.currentUser.avatarUrl,
      birthDate: mockStore.currentUser.birthDate,
      phone: mockStore.currentUser.phone,
      address: mockStore.currentUser.address,
      addressDetail: mockStore.currentUser.addressDetail,
      createdAt: mockStore.currentUser.createdAt,
      updatedAt: mockStore.currentUser.updatedAt,
    });
  }

  if (method === "PATCH" && path === "/auth/me") {
    return updateMe(body);
  }

  if (method === "POST" && path === "/auth/withdraw") {
    return withdrawMe();
  }

  if (method === "POST" && path === "/auth/refresh") {
    return ok({ accessToken: "mock-refreshed-access-token" });
  }

  return undefined;
}
