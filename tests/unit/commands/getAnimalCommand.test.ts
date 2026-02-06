import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAnimalCommand } from '../../../src/commands/getAnimalCommand';

vi.mock('../../../src/utils/databaseClient', () => ({
  db: {
    execute: vi.fn()
  }
}));

import { db } from '../../../src/utils/databaseClient';

describe('getAnimalCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return animal data when found', async () => {
    const mockAnimalData = {
      animalId: 'animal-123',
      name: 'Whiskers',
      gender: 'Female',
      ageInWeeks: 52,
      neutered: true,
      addressDisplayName: 'Brooklyn, NY',
      description: 'Friendly cat',
      createdAt: '2024-01-01T00:00:00.000Z',
      addressLatitude: 40.6782,
      addressLongitude: -73.9442,
      animalPhotos: [{ photoUrl: 'https://example.com/photo1.jpg', order: 1 }]
    };

    vi.mocked(db.execute).mockResolvedValue([mockAnimalData] as any);

    const result = await getAnimalCommand('user-123', 'animal-123');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockAnimalData);
    expect(db.execute).toHaveBeenCalledOnce();
  });

  it('should validate and parse result correctly', async () => {
    const mockAnimalData = {
      animalId: 'animal-456',
      name: 'Fluffy',
      gender: 'Male',
      ageInWeeks: 26,
      neutered: false,
      addressDisplayName: 'Manhattan, NY',
      description: 'Playful kitten',
      createdAt: '2024-02-01T00:00:00.000Z',
      addressLatitude: 40.7128,
      addressLongitude: -74.006,
      animalPhotos: []
    };

    vi.mocked(db.execute).mockResolvedValue([mockAnimalData] as any);

    const result = await getAnimalCommand('user-456', 'animal-456');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data?.name).toBe('Fluffy');
      expect(result.data?.gender).toBe('Male');
    }
  });
});
