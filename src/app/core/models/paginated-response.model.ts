export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}
