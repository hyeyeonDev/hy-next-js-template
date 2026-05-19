import { handleAuthMock } from "./handlers/auth.handler";
import { handleCommentsMock } from "./handlers/comments.handler";
import { handleContentMock } from "./handlers/content.handler";
import { handleDataCodesMock } from "./handlers/data-codes.handler";
import { handleDigitalMapMock } from "./handlers/digital-map.handler";
import { handleLoginHistoryMock } from "./handlers/login-history.handler";
import { handleOrganizationsMock } from "./handlers/organizations.handler";
import { handleUsersMock } from "./handlers/users.handler";
import { fail, parsePath, wait, type HttpMethod } from "./mock-utils";

interface MockApiRequest {
  method: HttpMethod;
  url: string;
  params?: object;
  body?: unknown;
}

const handlers = [
  handleAuthMock,
  handleUsersMock,
  handleLoginHistoryMock,
  handleOrganizationsMock,
  handleDataCodesMock,
  handleDigitalMapMock,
  handleCommentsMock,
  handleContentMock,
];

export async function handleMockRequest<T>({ method, url, params, body }: MockApiRequest): Promise<T> {
  await wait();

  const path = parsePath(url);
  const request = { method, path, params, body };

  for (const handler of handlers) {
    const response = handler(request);
    if (response !== undefined) {
      return response as T;
    }
  }

  fail(404, `[Mock API] ${method} ${path} 핸들러가 없습니다.`);
}
