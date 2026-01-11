import ngeohash from 'ngeohash';
import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { cache } from '../utils/cacheClient';
import {
  adoptableAnimalsValidator,
  type AdoptableAnimalsSchema
} from '../validators/database/adoptableAnimalsValidator';
import type { GetAdoptableAnimalsSchema } from '../validators/requests/getAdoptableAnimalsValidator';

export type GetAdoptableAnimalsCommandResponse = Promise<{
  success: boolean;
  data?: AdoptableAnimalsSchema;
  errorMsg?: string;
  totalResults?: number;
  page?: number;
  pageSize?: number;
}>;

function filterAnimals(
  animals: AdoptableAnimalsSchema,
  filters: GetAdoptableAnimalsSchema
) {
  return animals.filter((animal) => {
    if (filters.gender && animal.gender !== filters.gender) return false;
    if (filters.neutered && animal.neutered !== filters.neutered) return false;
    if (filters.minAgeWeeks > animal.ageInWeeks) return false;
    if (filters.maxAgeWeeks < animal.ageInWeeks) return false;
    return true;
  });
}

/**
 *
 * @param animalFilters The search criteria for finding animals
 * @param precision Indicates how accurate the provided coordinates are and will determine how wide/narrow the search for animals is
 * @param page The page number (1-indexed)
 * @param pageSize The number of items per page
 * @returns A {@link GetAdoptableAnimalsCommandResponse}
 */
export async function getAdoptableAnimalsCommand(
  animalFilters: GetAdoptableAnimalsSchema,
  precision: number,
  page: number,
  pageSize: number
): GetAdoptableAnimalsCommandResponse {
  try {
    const geohash = ngeohash.encode(
      animalFilters.latitude!,
      animalFilters.longitude!,
      precision
    );
    const cacheKey = `animalsForGeohash:${geohash}:${animalFilters.maxDistanceMeters}`;
    const offset = (page - 1) * pageSize;

    const cachedNearbyAnimals =
      await cache.get<AdoptableAnimalsSchema>(cacheKey);

    if (cachedNearbyAnimals) {
      // filter the animals and then get the page of animals that was requested
      const animals = filterAnimals(cachedNearbyAnimals, animalFilters);
      const pagedAnimals = animals.slice(offset, offset + pageSize);
      return {
        success: true,
        data: pagedAnimals,
        totalResults: animals.length,
        page,
        pageSize
      };
    }

    // Get all animals within maxDistanceKm kilometers of the location indicated by animalFilters
    const records = await db.execute(sql`
      SELECT
        a.animal_id AS animalId,
        a.name,
        a.gender,
        a.age_in_weeks AS ageInWeeks,
        a.neutered,
        a.description,
        ST_Y(a.address::geometry) AS addressLatitude,
        ST_X(a.address::geometry) AS addressLongitude,
        json_agg(
          json_build_object('photoUrl', ap.photo_url, 'order', ap.order)
          ORDER BY ap.order ASC
        ) FILTER (WHERE ap.photo_url IS NOT NULL) AS animalPhotos,
        ST_DISTANCE(
          a.address,
          ST_SetSRID(ST_MakePoint(${animalFilters.longitude}, ${animalFilters.latitude}, 4326)::geography
        ) as distanceMeters
      FROM animals a
      WHERE ST_DWithin(
        a.address,
        ST_SetSRID(ST_MakePoint(${animalFilters.longitude}, ${animalFilters.latitude}), 4326)::geography,
        ${animalFilters.maxDistanceMeters}
      )
      LEFT JOIN animalPhotos ap ON a.animal_id = ap.animal_id
      GROUP BY a.animal_id, a.name, a.gender, a.age_in_weeks, a.neutered, a.description, a.address
      ORDER BY distanceMeters ASC
    `);

    const validationResult = adoptableAnimalsValidator.safeParse(records);

    if (validationResult.success) {
      // cache the animals (10 minutes)
      await cache.set<AdoptableAnimalsSchema>(cacheKey, validationResult.data, {
        ex: 600
      });

      // filter the animals and then get the page of animals that was requested
      const animals = filterAnimals(validationResult.data, animalFilters);
      const pagedAnimals = animals.slice(offset, offset + pageSize);

      return {
        success: true,
        data: pagedAnimals,
        totalResults: animals.length,
        page,
        pageSize
      };
    } else {
      return {
        success: false,
        errorMsg: validationResult.error.issues
          .map((issue) => issue.message)
          .join('\n'),
        totalResults: 0,
        page,
        pageSize
      };
    }
  } catch (error) {
    return {
      success: false,
      errorMsg: (error as Error).message
    };
  }
}
