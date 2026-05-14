"use client";

import { useQuery } from "@tanstack/react-query";

import { kakaoService } from "@/api/external.api";

export function useKakaoAddressSearchQuery(query: string) {
  return useQuery({
    queryKey: ["kakao", "address", query],
    queryFn: () => kakaoService.searchAddress(query),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}
