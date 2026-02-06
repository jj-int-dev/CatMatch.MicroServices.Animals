import { vi } from 'vitest';

export const mockDbExecute = vi.fn();

export const mockDb = {
  execute: mockDbExecute
};

export function resetDatabaseMock() {
  mockDbExecute.mockReset();
}
