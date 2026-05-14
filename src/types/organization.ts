export interface Organization {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateOrganizationDto {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface OrganizationListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}
