import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import {
  animalValidator,
  type AnimalSchema
} from '../validators/database/animalValidator';
import type { ZodSafeParseResult } from 'zod';

export type GetAnimalCommandResponse = Promise<
  ZodSafeParseResult<AnimalSchema>
>;

/**
 *
 * @param userId The ID of the user whose animal listing should be fetched
 * @param animalId The ID of the animal listing to fetch
 * @returns A {@link GetAnimalCommandResponse}
 */
export async function getAnimalCommand(
  userId: string,
  animalId: string
): GetAnimalCommandResponse {
  const records = await db.execute(sql`
    SELECT
      a.animal_id AS "animalId",
      a.name,
      a.gender,
      a.age_in_weeks AS "ageInWeeks",
      a.neutered,
      a.address_display_name AS "addressDisplayName",
      a.description,
      created_at AS "createdAt",
      ST_Y(a.address::geometry) AS "addressLatitude",
      ST_X(a.address::geometry) AS "addressLongitude",
      json_agg(
        json_build_object('photoUrl', ap.photo_url, 'order', ap.order)
        ORDER BY ap.order ASC
      ) FILTER (WHERE ap.photo_url IS NOT NULL) AS "animalPhotos"
    FROM animals a
    LEFT JOIN animal_photos ap ON a.animal_id = ap.animal_id
    WHERE a.rehomer_id = ${userId} AND a.animal_id = ${animalId}
    GROUP BY a.animal_id, a.name, a.gender, a.age_in_weeks, a.neutered, a.address_display_name, a.description, a.created_at, a.address;
  `);
  return animalValidator.safeParse(
    Array.isArray(records) && records.length > 0 ? records[0] : null
  );
}
