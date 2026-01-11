import * as z from 'zod';
import { animalPhotosValidator } from '../animalPhotosValidator';

export const adoptableAnimalValidator = z
  .object({
    animalId: z.string().min(1),
    name: z.string().min(1),
    gender: z.enum(['Male', 'Female']),
    ageInWeeks: z.number().min(0),
    neutered: z.boolean(),
    description: z.string().min(1),
    addressLatitude: z.number(),
    addressLongitude: z.number(),
    animalPhotos: animalPhotosValidator
  })
  .nullable();

export type AdoptableAnimalSchema = z.infer<typeof adoptableAnimalValidator>;
