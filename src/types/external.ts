export interface KakaoAddressResult {
  address_name: string;
  address_type: string;
  x: string;
  y: string;
  road_address: {
    road_name: string;
    building_name: string;
  } | null;
}

export interface KakaoSearchResponse {
  documents: KakaoAddressResult[];
  meta: {
    total_count: number;
    is_end: boolean;
  };
}
