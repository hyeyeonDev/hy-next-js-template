import type { DigitalMapLocation } from "@/types";

// 대시보드 지구본의 샘플 위치입니다. 실제 API 연동 시 응답 데이터로 교체될 기준 mock입니다.
export const mockDigitalMapLocations: DigitalMapLocation[] = [
  { id: "P-2026-001", name: "서부 도시철도", country: "대한민국", countryCode: "KR", region: "서울", lat: 37.5665, lng: 126.978, type: "project" },
  { id: "P-2026-014", name: "하천 정비 조사", country: "대한민국", countryCode: "KR", region: "고양", lat: 37.6584, lng: 126.832, type: "project" },
  { id: "P-2026-021", name: "산단 안정성", country: "대한민국", countryCode: "KR", region: "인천", lat: 37.4563, lng: 126.7052, type: "project" },
  { id: "T-BH-104", name: "BH-104", country: "대한민국", countryCode: "KR", region: "마포", lat: 37.5519, lng: 126.94, type: "test" },
  { id: "T-WT-018", name: "지하수위 관측", country: "대한민국", countryCode: "KR", region: "파주", lat: 37.7599, lng: 126.7802, type: "test" },
  { id: "P-2026-JP1", name: "도쿄 항만 계측", country: "일본", countryCode: "JP", region: "도쿄", lat: 35.6762, lng: 139.6503, type: "project" },
  { id: "P-2026-US1", name: "서부 해안 지반 분석", country: "미국", countryCode: "US", region: "샌프란시스코", lat: 37.7749, lng: -122.4194, type: "project" },
  { id: "T-2026-SG1", name: "매립지 침하 관측", country: "싱가포르", countryCode: "SG", region: "싱가포르", lat: 1.3521, lng: 103.8198, type: "test" },
];
