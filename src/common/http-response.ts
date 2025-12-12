import { HttpResponse, PaginatedResponse } from './interfaces/http-response.interface';

export function ok<T>(data: T, message?: string): HttpResponse<T> {
  return {
    ok: true,
    data,
    message,
  };
}

export function error(message: string, statusCode?: number): HttpResponse<never> {
  return {
    ok: false,
    message,
  };
}

export function createHttpResponse<T>(
  ok: boolean,
  data?: T,
  message?: string,
): HttpResponse<T> {
  const response: HttpResponse<T> = { ok };
  
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  
  return response;
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return {
    ok: true,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
