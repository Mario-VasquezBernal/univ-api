/* eslint-disable */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export const parsePagination = (query: any) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  // Agregamos el cálculo que faltaba:
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

export const paginate = (data: any, page: any, limit: any): any => {
    return {
        data,
        meta: {
            page,
            limit,
            total: data.length
        }
    };
};