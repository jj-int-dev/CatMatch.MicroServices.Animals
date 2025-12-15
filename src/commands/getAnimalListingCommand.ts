import { eq, and, sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import {
  animalListingValidator,
  type AnimalListingSchema
} from '../validators/database/animalListingValidator';
import type { ZodSafeParseResult } from 'zod';

export type GetAnimalListingCommandResponse = Promise<
  ZodSafeParseResult<AnimalListingSchema>
>;

/**
 *
 * @param userId The ID of the user whose animal listing should be fetched
 * @param animalId The ID of the animal listing to fetch
 * @returns A {@link GetAnimalListingCommandResponse}
 */
export async function getAnimalListingCommand(
  userId: string,
  animalId: string
): GetAnimalListingCommandResponse {
  const records = await db.execute(sql`
    SELECT
      a.animal_id AS animalId,
      a.name,
      a.gender,
      a.age_in_weeks AS ageInWeeks,
      a.neutered,
      a.address_display_name AS addressDisplayName,
      description,
      created_at AS createdAt,
      ST_Y(a.address::geometry) AS addressLatitude,
      ST_X(a.address::geometry) AS addressLongitude,
      json_agg(
        json_build_object('photoUrl', ap.photo_url, 'order', ap.order)
        ORDER BY ap.order ASC
      ) FILTER (WHERE ap.photo_url IS NOT NULL) AS animalPhotos
    FROM animals a
    LEFT JOIN animalPhotos ap ON a.animal_id = ap.animal_id
    WHERE a.rehomer_id = ${userId} AND a.animal_id = ${animalId}
    GROUP BY a.animal_id, a.name, a.gender, a.age_in_weeks, a.neutered, a.address_display_name, a.description, a.created_at, a.address;
  `);

  return animalListingValidator.safeParse(
    Array.isArray(records) && records.length > 0 ? records[0] : null
  );
}
