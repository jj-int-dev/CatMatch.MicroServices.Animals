import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

// using fixed distances will increase cache hits for finding animals in a given area
function normalizeMaxDistanceMeters(maxDistanceMeters: number) {
  const distanceBuckets = [
    1000, 3000, 5000, 10000, 20000, 35000, 50000, 75000, 100000, 150000, 250000
  ];
  for (const bucket of distanceBuckets) {
    if (maxDistanceMeters <= bucket) return bucket;
  }
  return 250000;
}

const getAdoptableAnimalsValidations = z.object({
  gender: z
    .enum(['Male', 'Female'], `Invalid gender. 'Male' or 'Female' accepted.`)
    .optional(),
  minAgeWeeks: z
    .number()
    .int()
    .min(0, 'Age must be 0 weeks or more')
    .optional()
    .default(0),
  maxAgeWeeks: z
    .number()
    .int()
    .max(1920, 'Age must be 1920 weeks or less')
    .optional()
    .default(1920),
  neutered: z.boolean().optional().default(false),
  latitude: z
    .number()
    .min(-90)
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  longitude: z
    .number()
    .min(-180)
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
  maxDistanceMeters: z
    .number()
    .min(1000, 'Invalid minimum distance')
    .max(250000, 'Invalid maximum distance')
    .optional()
    .default(250000)
    .transform(normalizeMaxDistanceMeters)
});

export type GetAdoptableAnimalsSchema = z.infer<
  typeof getAdoptableAnimalsValidations
>;

export function getAdoptableAnimalsValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const animalFilters = getAdoptableAnimalsValidations.safeParse(req.body);

    if (!animalFilters.success) {
      const errors = animalFilters.error.issues.map((issue) => issue.message);
      console.log(
        `Get adoptable animals validation error(s):\n${errors.join('\n')}`
      );
      return res
        .status(400)
        .json({ message: 'Invalid search criteria for animals' });
    }

    return next();
  } catch (err) {
    console.log(
      `Error occurred during get adoptable animals validation middleware: ${err}`
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
