import * as z from 'zod';

export const animalPhotosValidator = z
  .array(
    z.object({
      photoUrl: z.url('Photo URL must be a valid URL'),
      order: z.int().min(0, 'Order must be 0 or greater')
    })
  )
  .max(5, 'Maximum 5 photos allowed');

export type AnimalPhotosSchema = z.infer<typeof animalPhotosValidator>;
