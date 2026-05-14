/**
 * 외부 서드파티 API 연동 예시
 *
 * 추가할 외부 API마다 이 파일처럼 별도로 만드세요:
 *   - kakao.api.ts
 *   - google.api.ts
 *   - public-data.api.ts  (공공데이터포털)
 *   - ...
 */

import { kakaoClient } from "@/lib/axios";
import type { KakaoSearchResponse } from "@/types/external";

export const kakaoService = {
  searchAddress: async (query: string) => {
    const { data } = await kakaoClient.get<KakaoSearchResponse>("/local/search/address.json", {
      params: { query },
    });
    return data;
  },
};

// ─── 공공데이터포털 예시 ──────────────────────────────────────────
// export const publicDataService = {
//   getHolidays: async (year: number) => {
//     const { data } = await publicDataClient.get("/B090041/openapi/service/SpcdeInfoService/getRestDeInfo", {
//       params: { solYear: year, ServiceKey: process.env.PUBLIC_DATA_KEY, _type: "json" },
//     });
//     return data;
//   },
// };
