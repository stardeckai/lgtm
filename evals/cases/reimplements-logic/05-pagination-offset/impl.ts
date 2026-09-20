export type PageRequest = { page: number; size: number; totalItems: number };

export type PageWindow = { offset: number; limit: number; lastPage: number; hasNext: boolean };

export function pageWindow(request: PageRequest): PageWindow {
  const size = Math.max(1, Math.min(request.size, 100));
  const lastPage = Math.max(1, Math.ceil(request.totalItems / size));
  const page = Math.max(1, Math.min(request.page, lastPage));
  const offset = (page - 1) * size;
  return { offset, limit: size, lastPage, hasNext: page < lastPage };
}
