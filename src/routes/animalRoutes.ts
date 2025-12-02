import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Implementation for rehomer endpoint
  res
    .status(200)
    .json({ message: `Animal with ID ${req.params.userId} rehomered.` });
});

export default router;
