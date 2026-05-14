import type { Organization } from "@/types";

export const mockOrganizations: Organization[] = [
  {
    id: 1,
    code: "HQ",
    name: "본사",
    description: "전체 운영과 공통 관리 조직",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: 2,
    code: "DEV",
    name: "개발팀",
    description: "서비스 개발 및 운영 자동화 담당",
    isActive: true,
    createdAt: "2026-01-04T02:30:00.000Z",
    updatedAt: "2026-05-11T04:12:00.000Z",
  },
  {
    id: 3,
    code: "CS",
    name: "고객지원팀",
    description: "문의, Q&A, 사용자 응대 담당",
    isActive: false,
    createdAt: "2026-02-14T08:20:00.000Z",
    updatedAt: "2026-05-02T11:30:00.000Z",
  },
];
