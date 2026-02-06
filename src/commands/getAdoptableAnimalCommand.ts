import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import {
  adoptableAnimalValidator,
  type AdoptableAnimalSchema
} from '../validators/database/adoptableAnimalValidator';
import type { ZodSafeParseResult } from 'zod';

export type GetAdoptableAnimalCommandResponse = Promise<
  ZodSafeParseResult<AdoptableAnimalSchema>
>;

/**
 * @param animalId The ID of the adoptable animal to fetch
 * @returns A {@link GetAnimalCommandResponse}
 */
export async function getAdoptableAnimalCommand(
  animalId: string
): GetAdoptableAnimalCommandResponse {
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
      a.rehomer_id AS rehomerId,
      json_agg(
        json_build_object('photoUrl', ap.photo_url, 'order', ap.order)
        ORDER BY ap.order ASC
      ) FILTER (WHERE ap.photo_url IS NOT NULL) AS animalPhotos
    FROM animals a
    LEFT JOIN animalPhotos ap ON a.animal_id = ap.animal_id
    WHERE a.animal_id = ${animalId}
    GROUP BY a.animal_id, a.name, a.gender, a.age_in_weeks, a.neutered, a.description, a.address, a.rehomer_id;
  `);

  return adoptableAnimalValidator.safeParse(
    Array.isArray(records) && records.length > 0 ? records[0] : null
  );
}
