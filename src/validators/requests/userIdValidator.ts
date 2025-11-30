import type { Request, Response, NextFunction } from 'express';

/**
 *
 * @param req the request
 * @param res the response
 * @param next the function that releases control to the next middleware or route handler
 * @returns
 */
export default function (req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId;

  if (!userId || userId.trim().length === 0) {
    console.log(`Invalid user ID: ${userId}`);
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  return next();
}
