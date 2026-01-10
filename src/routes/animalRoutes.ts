import { Router, type Request, type Response } from 'express';
import isAuthorized from '../validators/requests/isAuthorized';
import paginationValidator from '../validators/requests/paginationValidator';
import { getAdoptableAnimalsValidator } from '../validators/requests/getAdoptableAnimalsValidator';
import getErrorResponseJson from '../utils/getErrorResponseJson';
import animalIdValidator from '../validators/requests/animalIdValidator';
import { getAdoptableAnimalsAction } from '../actions/getAdoptableAnimalsAction';
import { getAdoptableAnimalAction } from '../actions/getAdoptableAnimalAction';

const router = Router();

router.get(
  '/:animalId',
  isAuthorized,
  animalIdValidator,
  async (req: Request, res: Response) => {
    try {
      const animal = await getAdoptableAnimalAction(req.params.animalId!);
      return res.status(200).json({ animal });
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

router.get(
  '',
  isAuthorized,
  paginationValidator,
  getAdoptableAnimalsValidator,
  async (req: Request, res: Response) => {
    try {
      const { animals, pagination } = await getAdoptableAnimalsAction(req);
      return res.status(200).json({ animals, pagination });
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

export default router;
