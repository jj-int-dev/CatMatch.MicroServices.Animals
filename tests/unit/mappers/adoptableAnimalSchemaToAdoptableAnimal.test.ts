import { describe, it, expect } from 'vitest';
import { toAdoptableAnimal } from '../../../src/mappers/adoptableAnimalSchemaToAdoptableAnimal';

describe('adoptableAnimalSchemaToAdoptableAnimal mapper', () => {
  it('should return null when input is null', () => {
    const result = toAdoptableAnimal(null);
    expect(result).toBeNull();
  });

  it('should remove addressLatitude and addressLongitude fields', () => {
    const input = {
      animalId: 'animal-123',
      name: 'Whiskers',
      gender: 'Female' as const,
      ageInWeeks: 52,
      neutered: true,
      description: 'Friendly cat',
      addressLatitude: 40.6782,
      addressLongitude: -73.9442,
      rehomerId: 'rehomer-123',
      animalPhotos: [{ photoUrl: 'https://example.com/photo1.jpg', order: 1 }]
    };

    const result = toAdoptableAnimal(input);

    expect(result).toBeDefined();
    expect(result).not.toHaveProperty('addressLatitude');
    expect(result).not.toHaveProperty('addressLongitude');
    expect(result?.animalId).toBe('animal-123');
    expect(result?.name).toBe('Whiskers');
    expect(result?.rehomerId).toBe('rehomer-123');
  });

  it('should preserve all other fields', () => {
    const input = {
      animalId: 'animal-456',
      name: 'Fluffy',
      gender: 'Male' as const,
      ageInWeeks: 26,
      neutered: false,
      description: 'Playful kitten',
      addressLatitude: 40.7128,
      addressLongitude: -74.006,
      rehomerId: 'rehomer-456',
      animalPhotos: []
    };

    const result = toAdoptableAnimal(input);

    expect(result).toBeDefined();
    expect(result?.animalId).toBe('animal-456');
    expect(result?.name).toBe('Fluffy');
    expect(result?.gender).toBe('Male');
    expect(result?.ageInWeeks).toBe(26);
    expect(result?.neutered).toBe(false);
    expect(result?.animalPhotos).toHaveLength(0);
  });
});
