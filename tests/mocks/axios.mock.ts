import { vi } from 'vitest';

export const mockAxiosGet = vi.fn();
export const mockAxiosPost = vi.fn();

export const mockAxiosGeoapifyClient = {
  get: mockAxiosGet,
  post: mockAxiosPost
};

export function resetAxiosMock() {
  mockAxiosGet.mockReset();
  mockAxiosPost.mockReset();
}
