import { Router, type Request, type Response } from 'express';
import isAuthorized from '../validators/requests/isAuthorized';
import userIdValidator from '../validators/requests/userIdValidator';
import getErrorResponseJson from '../utils/getErrorResponseJson';
import { getAnimalListingsAction } from '../actions/getAnimalListingsAction';
import animalIdValidator from '../validators/requests/animalIdValidator';
import { getAnimalListingAction } from '../actions/getAnimalListingAction';
import { addAnimalAction } from '../actions/addAnimalAction';
import { addAnimalPhotosAction } from '../actions/addAnimalPhotosAction';
import paginationValidator from '../validators/requests/paginationValidator';
import { addAnimalValidator } from '../validators/requests/addAnimalValidator';
import { updateAnimalValidator } from '../validators/requests/updateAnimalValidator';
import { addAnimalPhotosValidator } from '../validators/requests/addAnimalPhotosValidator';
import { updateAnimalPhotosValidator } from '../validators/requests/updateAnimalPhotosValidator';
import { deleteAnimalAction } from '../actions/deleteAnimalAction';
import { updateAnimalAction } from '../actions/updateAnimalAction';
import { updateAnimalPhotosAction } from '../actions/updateAnimalPhotosAction';

const router = Router();

router.post(
  '/:userId/add-animal-photos/:animalId',
  isAuthorized,
  userIdValidator,
  animalIdValidator,
  addAnimalPhotosValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId, animalId } = req.params;
      await addAnimalPhotosAction(
        userId!,
        animalId!,
        Array.isArray(req.files) ? req.files : []
      );
      return res.sendStatus(201);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.post(
  '/:userId/add-animal',
  isAuthorized,
  userIdValidator,
  addAnimalValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const animalId = await addAnimalAction(userId!, req.body);
      return res.status(201).json({ animalId });
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.get(
  '/:userId/animals/:animalId',
  isAuthorized,
  userIdValidator,
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
  isAuthorized,
  userIdValidator,
  animalIdValidator,
  updateAnimalValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId, animalId } = req.params;
      await updateAnimalAction(userId!, animalId!, req.body);
      return res.sendStatus(200);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.patch(
  '/:userId/update-animal-photos/:animalId',
  isAuthorized,
  userIdValidator,
  animalIdValidator,
  updateAnimalPhotosValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId, animalId } = req.params;
      await updateAnimalPhotosAction(
        userId!,
        animalId!,
        Array.isArray(req.files) ? req.files : []
      );
      return res.sendStatus(200);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.delete(
  '/:userId/remove-animal/:animalId',
  isAuthorized,
  userIdValidator,
  animalIdValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId, animalId } = req.params;
      await deleteAnimalAction(userId!, animalId!);
      return res.sendStatus(204);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
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
