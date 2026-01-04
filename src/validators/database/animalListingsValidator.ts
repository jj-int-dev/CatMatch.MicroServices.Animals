import * as z from 'zod';
import { animalPhotosValidator } from '../animalPhotosValidator';

export const animalListingsValidator = z.array(
  z.object({
    animalId: z.string().min(1),
    name: z.string().min(1),
    gender: z.enum(['Male', 'Female']),
    ageInWeeks: z.number().min(0),
    neutered: z.boolean(),
    addressDisplayName: z.string().min(1),
    description: z.string().min(1),
    createdAt: z.iso.datetime(),
    addressLatitude: z.number(),
    addressLongitude: z.number(),
    animalPhotos: animalPhotosValidator
  })
);

export type AnimalListingsSchema = z.infer<typeof animalListingsValidator>;
