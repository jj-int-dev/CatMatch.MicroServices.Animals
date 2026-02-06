import * as z from 'zod';
import { animalPhotosValidator } from '../animalPhotosValidator';

export const adoptableAnimalsValidator = z.array(
  z.object({
    animalId: z.string().min(1),
    name: z.string().min(1),
    gender: z.enum(['Male', 'Female']),
    ageInWeeks: z.number().min(0),
    neutered: z.boolean(),
    description: z.string().min(1),
    addressLatitude: z.number(),
    addressLongitude: z.number(),
    rehomerId: z.string().min(1),
    distanceMeters: z.number(),
    animalPhotos: animalPhotosValidator
  })
);

export type AdoptableAnimalsSchema = z.infer<typeof adoptableAnimalsValidator>;
