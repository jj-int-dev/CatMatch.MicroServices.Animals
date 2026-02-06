import { Router, type Request, type Response } from 'express';
import isAuthorized from '../validators/requests/isAuthorized';
import userIdValidator from '../validators/requests/userIdValidator';
import getErrorResponseJson from '../utils/getErrorResponseJson';
import { getAnimalsAction } from '../actions/getAnimalsAction';
import animalIdValidator from '../validators/requests/animalIdValidator';
import { getAnimalAction } from '../actions/getAnimalAction';
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
import { deleteAnimalsForRehomerAction } from '../actions/deleteAnimalsForRehomerAction';

const router = Router();

/**
 * @swagger
 * /api/rehomers/{userId}/add-animal-photos/{animalId}:
 *   post:
 *     summary: Add photos to an existing animal
 *     description: Uploads and associates photos with an existing animal. Maximum of 5 photos allowed per animal. Requires the authenticated user to be the owner (rehomer) of the animal. This endpoint accepts multipart/form-data for file uploads.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the animal
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Photo files to upload (maximum 5 photos per animal)
 *     responses:
 *       201:
 *         description: Photos successfully added to the animal
 *       400:
 *         description: Invalid request - Invalid userId, animalId, or photo validation failed (e.g., exceeds maximum of 5 photos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/rehomers/{userId}/add-animal:
 *   post:
 *     summary: Create a new animal listing
 *     description: Creates a new animal listing for rehoming. The authenticated user becomes the owner (rehomer) of the animal. All fields are required. Photos can be added separately using the add-animal-photos endpoint.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - ageInWeeks
 *               - neutered
 *               - addressDisplayName
 *               - description
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Name of the animal
 *                 example: Whiskers
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *                 description: Gender of the animal
 *                 example: Female
 *               ageInWeeks:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1920
 *                 description: Age of the animal in weeks (1920 weeks = ~37 years)
 *                 example: 52
 *               neutered:
 *                 type: boolean
 *                 description: Whether the animal is neutered/spayed
 *                 example: true
 *               addressDisplayName:
 *                 type: string
 *                 minLength: 1
 *                 description: Human-readable address or location name
 *                 example: Brooklyn, New York
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: Detailed description of the animal
 *                 example: Friendly and playful cat looking for a loving home
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *           example:
 *             name: Whiskers
 *             gender: Female
 *             ageInWeeks: 52
 *             neutered: true
 *             addressDisplayName: Brooklyn, New York
 *             description: Friendly and playful cat looking for a loving home. Gets along well with children and other pets.
 *             address:
 *               latitude: 40.6782
 *               longitude: -73.9442
 *     responses:
 *       201:
 *         description: Animal successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animalId:
 *                   type: string
 *                   description: Unique identifier of the newly created animal
 *       400:
 *         description: Invalid request - Validation failed for one or more fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - userId does not match authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/rehomers/{userId}/animals/{animalId}:
 *   get:
 *     summary: Get a specific animal owned by a rehomer
 *     description: Retrieves detailed information about a specific animal owned by the specified rehomer, including all photos and location details. Requires authentication and user must own the animal.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the animal
 *     responses:
 *       200:
 *         description: Successfully retrieved animal information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animal:
 *                   $ref: '#/components/schemas/Animal'
 *       400:
 *         description: Invalid userId or animalId format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:userId/animals/:animalId',
  isAuthorized,
  userIdValidator,
  animalIdValidator,
  async (req: Request, res: Response) => {
    try {
      const { userId, animalId } = req.params;
      const animal = await getAnimalAction(userId!, animalId!);
      return res.status(200).json({ animal });
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

/**
 * @swagger
 * /api/rehomers/{userId}/animals:
 *   get:
 *     summary: Get all animals owned by a rehomer
 *     description: Retrieves a paginated list of all animals owned by the specified rehomer. Requires authentication and user must match the userId parameter.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Number of results per page (maximum 20)
 *     responses:
 *       200:
 *         description: Successfully retrieved list of animals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Animal'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid userId or pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - userId does not match authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:userId/animals',
  isAuthorized,
  userIdValidator,
  paginationValidator,
  async (req: Request, res: Response) => {
    try {
      const { animals, pagination } = await getAnimalsAction(
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

/**
 * @swagger
 * /api/rehomers/{userId}/update-animal/{animalId}:
 *   patch:
 *     summary: Update an existing animal listing
 *     description: Updates one or more fields of an existing animal listing. At least one field must be provided. Only the animal owner (rehomer) can update the animal. All fields are optional, but at least one must be present.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the animal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Name of the animal
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *                 description: Gender of the animal
 *               ageInWeeks:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 1920
 *                 description: Age of the animal in weeks
 *               neutered:
 *                 type: boolean
 *                 description: Whether the animal is neutered/spayed
 *               addressDisplayName:
 *                 type: string
 *                 minLength: 1
 *                 description: Human-readable address or location name
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: Detailed description of the animal
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *           example:
 *             name: Whiskers Jr
 *             ageInWeeks: 60
 *             description: Updated description with more details about this wonderful cat
 *     responses:
 *       200:
 *         description: Animal successfully updated
 *       400:
 *         description: Invalid request - Validation failed or no fields provided for update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/rehomers/{userId}/update-animal-photos/{animalId}:
 *   patch:
 *     summary: Update photos for an existing animal
 *     description: Replaces existing photos for an animal with new photos. Maximum of 5 photos allowed per animal. Only the animal owner (rehomer) can update photos. This endpoint accepts multipart/form-data for file uploads.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the animal
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Photo files to upload (maximum 5 photos per animal)
 *     responses:
 *       200:
 *         description: Photos successfully updated for the animal
 *       400:
 *         description: Invalid request - Invalid userId, animalId, or photo validation failed (e.g., exceeds maximum of 5 photos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/rehomers/{userId}/remove-animal/{animalId}:
 *   delete:
 *     summary: Delete a specific animal listing
 *     description: Permanently deletes an animal listing and all associated data including photos. Only the animal owner (rehomer) can delete the animal. This action cannot be undone.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the animal to delete
 *     responses:
 *       204:
 *         description: Animal successfully deleted (no content returned)
 *       400:
 *         description: Invalid userId or animalId format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User does not own this animal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/rehomers/{userId}/remove-all-animals:
 *   delete:
 *     summary: Delete all animals owned by a rehomer
 *     description: Permanently deletes all animal listings and associated data (including photos) for the specified rehomer. Only the authenticated user matching the userId can perform this action. This action cannot be undone and will remove all animals from the rehomer's account.
 *     tags:
 *       - Rehomers
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the rehomer (must match authenticated user)
 *     responses:
 *       200:
 *         description: All animals successfully deleted
 *       400:
 *         description: Invalid userId format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid authentication tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - userId does not match authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:userId/remove-all-animals',
  isAuthorized,
  userIdValidator,
  async (req: Request, res: Response) => {
    try {
      await deleteAnimalsForRehomerAction(req.params.userId!);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

export default router;
