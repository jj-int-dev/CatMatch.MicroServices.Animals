import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addAnimalCommand } from '../../../src/commands/addAnimalCommand';
import HttpResponseError from '../../../src/dtos/httpResponseError';

vi.mock('../../../src/utils/databaseClient', () => ({
  db: {
    execute: vi.fn()
  }
}));

import { db } from '../../../src/utils/databaseClient';

describe('addAnimalCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validAnimalData = {
    name: 'Whiskers',
    gender: 'Female' as const,
    ageInWeeks: 52,
    neutered: true,
    addressDisplayName: 'Brooklyn, NY',
    description: 'Friendly cat',
    address: {
      latitude: 40.6782,
      longitude: -73.9442
    }
  };

  it('should create animal and return animalId', async () => {
    const mockResult = [{ animal_id: 'animal-new-123' }];
    vi.mocked(db.execute).mockResolvedValue(mockResult as any);

    const result = await addAnimalCommand('user-123', validAnimalData);

    expect(result).toBe('animal-new-123');
    expect(db.execute).toHaveBeenCalledOnce();
  });

  it('should throw HttpResponseError when insert fails', async () => {
    vi.mocked(db.execute).mockResolvedValue([] as any);

    await expect(addAnimalCommand('user-123', validAnimalData)).rejects.toThrow(
      HttpResponseError
    );

    await expect(addAnimalCommand('user-123', validAnimalData)).rejects.toThrow(
      'Failed to create animal'
    );
  });

  it('should handle database errors', async () => {
    vi.mocked(db.execute).mockRejectedValue(new Error('Database error'));

    await expect(
      addAnimalCommand('user-123', validAnimalData)
    ).rejects.toThrow();
  });
});
