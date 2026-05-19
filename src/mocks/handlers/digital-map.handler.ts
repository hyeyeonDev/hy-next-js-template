import { ok, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";

export function handleDigitalMapMock({ method, path }: MockRequest) {
  if (method === "GET" && path === "/digital-map/locations") {
    return ok(mockStore.digitalMapLocations);
  }

  return undefined;
}
