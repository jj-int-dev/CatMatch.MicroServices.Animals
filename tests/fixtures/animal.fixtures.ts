import type { AnimalSchema } from '../../src/validators/database/animalValidator';
import type { AddAnimalSchema } from '../../src/validators/requests/addAnimalValidator';

export const mockAnimalData: AnimalSchema = {
  animalId: 'animal-123',
  name: 'Whiskers',
  gender: 'Female',
  ageInWeeks: 52,
  neutered: true,
  addressDisplayName: 'Brooklyn, NY',
  description: 'Friendly cat looking for a home',
  createdAt: '2024-01-01T00:00:00.000Z',
  addressLatitude: 40.6782,
  addressLongitude: -73.9442,
  animalPhotos: [
    { photoUrl: 'https://example.com/photo1.jpg', order: 1 },
    { photoUrl: 'https://example.com/photo2.jpg', order: 2 }
  ]
};

export const mockAddAnimalData: AddAnimalSchema = {
  name: 'Fluffy',
  gender: 'Male',
  ageInWeeks: 26,
  neutered: false,
  addressDisplayName: 'Manhattan, NY',
  description: 'Playful kitten',
  address: {
    latitude: 40.7128,
    longitude: -74.006
  }
};

export const mockAnimalsArray = [mockAnimalData];
