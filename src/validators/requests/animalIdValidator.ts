import type { Request, Response, NextFunction } from 'express';

/**
 *
 * @param req the request
 * @param res the response
 * @param next the function that releases control to the next middleware or route handler
 * @returns
 */
export default function (req: Request, res: Response, next: NextFunction) {
  const animalId = req.params.animalId;

  if (!animalId || animalId.trim().length === 0) {
    console.log(`Invalid animal ID: ${animalId}`);
    return res.status(400).json({ message: 'Invalid animal ID' });
  }
  return next();
}
