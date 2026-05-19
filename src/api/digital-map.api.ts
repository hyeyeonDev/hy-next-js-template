import { apiClient } from "@/lib/axios";
import type { ApiResponse, DigitalMapLocation } from "@/types";

export const digitalMapService = {
  getLocations: async () => {
    const { data } = await apiClient.get<ApiResponse<DigitalMapLocation[]>>("/digital-map/locations");
    return data.data;
  },
};
