import { vi } from 'vitest';

export const mockCacheGet = vi.fn();
export const mockCacheSet = vi.fn();
export const mockCacheDel = vi.fn();

export const mockCache = {
  get: mockCacheGet,
  set: mockCacheSet,
  del: mockCacheDel
};

export function resetCacheMock() {
  mockCacheGet.mockReset();
  mockCacheSet.mockReset();
  mockCacheDel.mockReset();
}
