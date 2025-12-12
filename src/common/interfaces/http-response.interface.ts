export interface HttpResponse<T = unknown> {
  ok: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  ok: true;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
