import type { Request, Response, NextFunction } from 'express';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!!req.query.page && (isNaN(+req.query.page) || +req.query.page < 1)) {
      return res
        .status(400)
        .json({ message: 'Page must be a number with a value of at least 1' });
    }
    if (
      !!req.query.pageSize &&
      (isNaN(+req.query.pageSize) ||
        +req.query.pageSize < 1 ||
        +req.query.pageSize > 20)
    ) {
      return res.status(400).json({
        message: 'Page size must be a number between 1 and 20 (inclusive)'
      });
    }
    if (!req.query.page) req.query.page = '1';
    if (!req.query.pageSize) req.query.pageSize = '10';

    return next();
  } catch (err) {
    console.log(`Error during pagination validation middleware: ${err}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
