import type { FindIdDto, FindPasswordDto, LoginDto, SignupDto } from "@/types/auth";
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
    role: "user",
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
    });
  }

  if (method === "POST" && path === "/auth/refresh") {
    return ok({ accessToken: "mock-refreshed-access-token" });
  }

  return undefined;
}
