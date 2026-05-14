export type DataCodeLevel = "large" | "medium" | "small";

export interface DataCode {
  id: number;
  level: DataCodeLevel;
  code: string;
  codeName: string;
  sortOrder: number;
  description?: string;
  parentCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataCodeDto {
  level: DataCodeLevel;
  code: string;
  codeName: string;
  sortOrder: number;
  description?: string;
  parentCode?: string;
}

export interface UpdateDataCodeDto {
  level?: DataCodeLevel;
  code?: string;
  codeName?: string;
  sortOrder?: number;
  description?: string;
  parentCode?: string;
}

export interface DataCodeListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  level?: DataCodeLevel;
  parentCode?: string;
}

export interface CheckDataCodeResponse {
  code: string;
  exists: boolean;
}
