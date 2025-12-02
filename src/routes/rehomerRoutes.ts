import { Router, type Request, type Response } from 'express';
import isAuthorized from '../validators/requests/isAuthorized';
import userIdValidator from '../validators/requests/userIdValidator';
import getErrorResponseJson from '../utils/getErrorResponseJson';
import getAnimalListingsAction from '../actions/getAnimalListingsAction';
import animalIdValidator from '../validators/requests/animalIdValidator';
import userCanMakeAnimalUpdatesValidator from '../validators/requests/userCanMakeAnimalUpdatesValidator';
import getAnimalListingAction from '../actions/getAnimalListingAction';

const router = Router();

router.post(
  '/:userId/add-animal-photos',
  async (req: Request, res: Response) => {
    // Implementation for rehomer endpoint
    res
      .status(200)
      .json({ message: `Animal with ID ${req.params.userId} rehomered.` });
  }
);

router.post('/:userId/add-animal', async (req: Request, res: Response) => {
  // Implementation for rehomer endpoint
  res
    .status(200)
    .json({ message: `Animal with ID ${req.params.userId} rehomered.` });
});

router.get(
  '/:userId/animals/:animalId',
  isAuthorized,
  userIdValidator,
  userCanMakeAnimalUpdatesValidator,
  animalIdValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId, animalId } = req.params;
      const animal = await getAnimalListingAction(userId!, animalId!);
      return res.status(200).json({ animal });
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.get(
  '/:userId/animals',
  isAuthorized,
  userIdValidator,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId!;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string)
        : 10;

      // Validate pagination parameters
      if (page < 1) {
        return res.status(400).json({ message: 'Page must be at least 1' });
      }
      if (pageSize < 1 || pageSize > 100) {
        return res
          .status(400)
          .json({ message: 'Page size must be between 1 and 100' });
      }

      const result = await getAnimalListingsAction(userId, page, pageSize);
      return res.status(200).json(result);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.patch(
  '/:userId/update-animal/:animalId',
  async (req: Request, res: Response) => {
    // Implementation for rehomer endpoint
    res
      .status(200)
      .json({ message: `Animal with ID ${req.params.userId} rehomered.` });
  }
);

router.delete(
  '/:userId/remove-animal/:animalId',
  async (req: Request, res: Response) => {
    // Implementation for rehomer endpoint
    res
      .status(200)
      .json({ message: `Animal with ID ${req.params.userId} rehomered.` });
  }
);

router.delete(
  '/:userId/remove-all-animals',
  async (req: Request, res: Response) => {
    // Implementation for rehomer endpoint
    res
      .status(200)
      .json({ message: `Animal with ID ${req.params.userId} rehomered.` });
  }
);

export default router;
