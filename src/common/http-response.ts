export function ok<T>(data: T, meta: Record<string, any> = {}) {
  return { ok: true, data, meta };
}
