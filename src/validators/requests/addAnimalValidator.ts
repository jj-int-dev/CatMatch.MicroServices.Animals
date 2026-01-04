import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

const addAnimalValidations = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be 200 characters or less'),
  gender: z.enum(['Male', 'Female']),
  ageInWeeks: z
    .number()
    .int()
    .positive('Age must be a positive number')
    .max(1920, 'Age must be 1920 weeks or less'),
  neutered: z.boolean(),
  addressDisplayName: z.string().min(1, 'Address display name is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be 1000 characters or less'),
  address: z.object({
    latitude: z
      .number()
      .min(-90)
      .max(90, 'Latitude must be between -90 and 90'),
    longitude: z
      .number()
      .min(-180)
      .max(180, 'Longitude must be between -180 and 180')
  })
});

export type AddAnimalSchema = z.infer<typeof addAnimalValidations>;

export function addAnimalValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newAnimalData = addAnimalValidations.safeParse(req.body);

    if (!newAnimalData.success) {
      const errors = newAnimalData.error.issues.map((issue) => issue.message);
      console.log(`Animal data validation error(s):\n${errors.join('\n')}`);
      return res.status(400).json({ message: 'Invalid animal data' });
    }

    return next();
  } catch (err) {
    console.log(
      `Error occurred during new animal data validation middleware: ${err}`
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
