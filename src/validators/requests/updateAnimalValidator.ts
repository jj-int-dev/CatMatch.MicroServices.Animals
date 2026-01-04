import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

const updateAnimalValidations = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(200, 'Name must be 200 characters or less')
      .optional(),
    gender: z.enum(['Male', 'Female']).optional(),
    ageInWeeks: z
      .number()
      .min(0, 'Age must be 0 or greater')
      .max(1920, 'Age must be 1920 weeks or less')
      .optional(),
    neutered: z.boolean().optional(),
    addressDisplayName: z
      .string()
      .min(1, 'Address display name is required')
      .optional(),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description must be 1000 characters or less')
      .optional(),
    address: z
      .object({
        latitude: z
          .number()
          .min(-90)
          .max(90, 'Latitude must be between -90 and 90'),
        longitude: z
          .number()
          .min(-180)
          .max(180, 'Longitude must be between -180 and 180')
      })
      .optional()
  })
  .refine(
    (data) => {
      // At least one field should be provided for update
      return Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined
      );
    },
    {
      message: 'At least one field must be provided for update'
    }
  );

export type UpdateAnimalSchema = z.infer<typeof updateAnimalValidations>;

export function updateAnimalValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newAnimalData = updateAnimalValidations.safeParse(req.body);

    if (!newAnimalData.success) {
      const errors = newAnimalData.error.issues.map((issue) => issue.message);
      console.log(`Animal data validation error(s):\n${errors.join('\n')}`);
      return res.status(400).json({ message: 'Invalid animal data' });
    }

    return next();
  } catch (err) {
    console.log(
      `Error occurred during animal data validation middleware: ${err}`
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
