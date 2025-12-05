import { Router, type Request, type Response } from 'express';
import isAuthorized from '../validators/requests/isAuthorized';
import userIdValidator from '../validators/requests/userIdValidator';
import getErrorResponseJson from '../utils/getErrorResponseJson';
import { getAnimalListingsAction } from '../actions/getAnimalListingsAction';
import animalIdValidator from '../validators/requests/animalIdValidator';
import userCanMakeAnimalUpdatesValidator from '../validators/requests/userCanMakeAnimalUpdatesValidator';
import { getAnimalListingAction } from '../actions/getAnimalListingAction';
import HttpResponseError from '../dtos/httpResponseError';
import paginationValidator from '../validators/requests/paginationValidator';

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
  paginationValidator,
  async (req: Request, res: Response) => {
    try {
      const { animals, pagination } = await getAnimalListingsAction(
        req.params.userId!,
        +req.query.page!,
        +req.query.pageSize!
      );
      return res.status(200).json({ animals, pagination });
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
