import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import type { AddAnimalSchema } from '../validators/requests/addAnimalValidator';
import HttpResponseError from '../dtos/httpResponseError';

/**
 * Adds a new animal to the database
 * @param userId The ID of the user (rehomer) creating the animal
 * @param animalData The animal data to add
 * @throws A {@link HttpResponseError} or {@link Error} If an error occurred while adding the animal to the database
 */
export async function addAnimalCommand(
  userId: string,
  animalData: AddAnimalSchema
): Promise<string> {
  console.log('Entering addAnimalListingCommand...');

  // Convert address to PostGIS POINT geometry
  const { latitude, longitude } = animalData.address;
  const point = `ST_MakePoint(${longitude}, ${latitude})`;

  // Insert the animal record
  const result = await db.execute(sql`
    INSERT INTO animals (
      name,
      gender,
      age_in_weeks,
      neutered,
      address_display_name,
      description,
      rehomer_id,
      address
    ) VALUES (
      ${animalData.name},
      ${animalData.gender},
      ${animalData.ageInWeeks},
      ${animalData.neutered},
      ${animalData.addressDisplayName},
      ${animalData.description},
      ${userId},
      ST_SetSRID(${point}, 4326)::geography
    )
    RETURNING *;
  `);

  if (result.length < 1) {
    const baseErrorMsg = 'Failed to create animal';
    console.error(`${baseErrorMsg} for user ${userId}`);
    throw new HttpResponseError(500, baseErrorMsg);
  }

  return `${result[0]!['animal_id']}`;
}
