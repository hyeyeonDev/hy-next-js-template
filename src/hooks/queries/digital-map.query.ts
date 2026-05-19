"use client";

import { useQuery } from "@tanstack/react-query";

import { digitalMapService } from "@/api/digital-map.api";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useDigitalMapLocationsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.DIGITAL_MAP.locations(),
    queryFn: digitalMapService.getLocations,
    staleTime: 60 * 1000,
  });
}
