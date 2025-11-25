export function ok<T = any>(data: T, meta?: Record<string, any>) {
  return meta ? { data, meta } : { data };
}
