import { vi } from 'vitest';

export const mockGetUser = vi.fn();
export const mockUpload = vi.fn();
export const mockRemove = vi.fn();
export const mockGetPublicUrl = vi.fn();

export const mockSupabase = {
  auth: {
    getUser: mockGetUser
  },
  storage: {
    from: vi.fn(() => ({
      upload: mockUpload,
      remove: mockRemove,
      getPublicUrl: mockGetPublicUrl
    }))
  }
};

export function resetSupabaseMock() {
  mockGetUser.mockReset();
  mockUpload.mockReset();
  mockRemove.mockReset();
  mockGetPublicUrl.mockReset();
}
