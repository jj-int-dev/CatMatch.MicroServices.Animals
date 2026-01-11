import type { AdoptableAnimalsSchema } from '../validators/database/adoptableAnimalsValidator';

export type AdoptableAnimals = {
  animalId: string;
  name: string;
  gender: 'Male' | 'Female';
  ageInWeeks: number;
  neutered: boolean;
  description: string;
  distanceMeters: number;
  animalPhotos: {
    photoUrl: string;
    order: number;
  }[];
}[];

export function toAdoptableAnimals(
  animals: AdoptableAnimalsSchema
): AdoptableAnimals {
  return animals.map((a) => {
    const { addressLatitude, addressLongitude, ...rest } = a;
    return rest;
  });
}
