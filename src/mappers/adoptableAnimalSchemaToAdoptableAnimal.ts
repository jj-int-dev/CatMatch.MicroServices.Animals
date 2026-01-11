import type { AdoptableAnimalSchema } from '../validators/database/adoptableAnimalValidator';

export type AdoptableAnimal = Omit<
  NonNullable<AdoptableAnimalSchema>,
  'addressLatitude' | 'addressLongitude'
> | null;

export function toAdoptableAnimal(
  animalSchema: AdoptableAnimalSchema
): AdoptableAnimal {
  if (animalSchema == null) return null;
  const { addressLatitude, addressLongitude, ...rest } = animalSchema;
  return rest;
}
