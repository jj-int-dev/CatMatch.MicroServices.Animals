import { Router, type Request, type Response } from 'express';
import isAuthorized from '../validators/requests/isAuthorized';
import paginationValidator from '../validators/requests/paginationValidator';
import { getAdoptableAnimalsValidator } from '../validators/requests/getAdoptableAnimalsValidator';
import getErrorResponseJson from '../utils/getErrorResponseJson';
import animalIdValidator from '../validators/requests/animalIdValidator';
import { getAdoptableAnimalsAction } from '../actions/getAdoptableAnimalsAction';
import { getAdoptableAnimalAction } from '../actions/getAdoptableAnimalAction';

const router = Router();

/**
 * @swagger
 * /api/animals/{animalId}:
 *   get:
 *     summary: Get a single adoptable animal by ID
 *     description: Retrieves detailed information about a specific adoptable animal including photos, location, and characteristics. Requires authentication with valid access and refresh tokens.
 *     tags:
 *       - Animals
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
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
 *                   $ref: '#/components/schemas/AdoptableAnimal'
 *       400:
 *         description: Invalid animal ID format
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

/**
 * @swagger
 * /api/animals:
 *   post:
 *     summary: Search for adoptable animals with filters
 *     description: Retrieves a paginated list of adoptable animals based on search criteria including gender, age range, location, and distance. Supports multiple location sources (client IP, current location, or custom location). Requires authentication with valid access and refresh tokens.
 *     tags:
 *       - Animals
 *     security:
 *       - bearerAuth: []
 *         refreshToken: []
 *     parameters:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationSource
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *                 nullable: true
 *                 description: Filter by animal gender (null for any gender)
 *               minAgeWeeks:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Minimum age in weeks
 *               maxAgeWeeks:
 *                 type: integer
 *                 maximum: 1920
 *                 default: 1920
 *                 description: Maximum age in weeks (1920 weeks = ~37 years)
 *               neutered:
 *                 type: boolean
 *                 default: false
 *                 description: Filter for neutered/spayed animals only
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 nullable: true
 *                 description: Latitude for location-based search (required for client-current-location and client-custom-location)
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 nullable: true
 *                 description: Longitude for location-based search (required for client-current-location and client-custom-location)
 *               locationSource:
 *                 type: string
 *                 enum: [client-ip, client-current-location, client-custom-location]
 *                 description: Source of location data - 'client-ip' uses IP geolocation, 'client-current-location' uses provided coordinates from device, 'client-custom-location' uses user-specified location
 *               locationDetails:
 *                 type: string
 *                 nullable: true
 *                 description: Human-readable location details (required when locationSource is 'client-custom-location')
 *               maxDistanceMeters:
 *                 type: integer
 *                 minimum: 1000
 *                 maximum: 250000
 *                 default: 250000
 *                 description: Maximum distance from location in meters (normalized to predefined buckets for cache optimization)
 *           examples:
 *             searchByIPLocation:
 *               summary: Search using client IP location
 *               value:
 *                 gender: null
 *                 minAgeWeeks: 0
 *                 maxAgeWeeks: 520
 *                 neutered: false
 *                 latitude: null
 *                 longitude: null
 *                 locationSource: client-ip
 *                 locationDetails: null
 *                 maxDistanceMeters: 50000
 *             searchByCurrentLocation:
 *               summary: Search using current device location
 *               value:
 *                 gender: Female
 *                 minAgeWeeks: 12
 *                 maxAgeWeeks: 260
 *                 neutered: true
 *                 latitude: 40.7128
 *                 longitude: -74.0060
 *                 locationSource: client-current-location
 *                 locationDetails: null
 *                 maxDistanceMeters: 20000
 *             searchByCustomLocation:
 *               summary: Search using custom location
 *               value:
 *                 gender: Male
 *                 minAgeWeeks: 0
 *                 maxAgeWeeks: 1920
 *                 neutered: false
 *                 latitude: 34.0522
 *                 longitude: -118.2437
 *                 locationSource: client-custom-location
 *                 locationDetails: Los Angeles, CA
 *                 maxDistanceMeters: 100000
 *     responses:
 *       200:
 *         description: Successfully retrieved list of adoptable animals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdoptableAnimal'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid search criteria or pagination parameters
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '',
  isAuthorized,
  paginationValidator,
  getAdoptableAnimalsValidator,
  async (req: Request, res: Response) => {
    try {
      const result = await getAdoptableAnimalsAction(req);
      return res.status(200).json(result);
    } catch (error) {
      return getErrorResponseJson(error, res);
    }
  }
);

export default router;
