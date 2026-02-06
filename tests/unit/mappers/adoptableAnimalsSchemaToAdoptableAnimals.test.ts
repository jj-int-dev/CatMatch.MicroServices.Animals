import { describe, it, expect } from 'vitest';
import { toAdoptableAnimals } from '../../../src/mappers/adoptableAnimalsSchemaToAdoptableAnimals';

describe('adoptableAnimalsSchemaToAdoptableAnimals mapper', () => {
  it('should return empty array when input is empty array', () => {
    const result = toAdoptableAnimals([]);
    expect(result).toEqual([]);
  });

  it('should map array of animals correctly', () => {
    const input = [
      {
        animalId: 'animal-1',
        name: 'Cat1',
        gender: 'Female' as const,
        ageInWeeks: 52,
        neutered: true,
        description: 'Friendly',
        addressLatitude: 40.6782,
        addressLongitude: -73.9442,
        rehomerId: 'rehomer-1',
        distanceMeters: 5000,
        animalPhotos: []
      },
      {
        animalId: 'animal-2',
        name: 'Cat2',
        gender: 'Male' as const,
        ageInWeeks: 26,
        neutered: false,
        description: 'Playful',
        addressLatitude: 40.7128,
        addressLongitude: -74.006,
        rehomerId: 'rehomer-2',
        distanceMeters: 10000,
        animalPhotos: [{ photoUrl: 'https://example.com/photo.jpg', order: 1 }]
      }
    ];

    const result = toAdoptableAnimals(input);

    expect(result).toHaveLength(2);
    expect(result[0]).not.toHaveProperty('addressLatitude');
    expect(result[0]).not.toHaveProperty('addressLongitude');
    expect(result[0]?.animalId).toBe('animal-1');
    expect(result[1]?.animalId).toBe('animal-2');
  });
});
