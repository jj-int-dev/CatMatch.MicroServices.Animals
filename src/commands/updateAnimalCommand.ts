import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import type { UpdateAnimalSchema } from '../validators/requests/updateAnimalValidator';
import HttpResponseError from '../dtos/httpResponseError';
import doesAnimalExistCommand from './doesAnimalExistCommand';

/**
 * Updates an existing animal in the database
 * @param userId The ID of the user (rehomer) who owns the animal
 * @param animalId The ID of the animal to update
 * @param animalData The animal data to update (partial)
 * @throws A {@link HttpResponseError} or {@link Error} If an error occurred while updating the animal in the database
 */
export async function updateAnimalCommand(
  userId: string,
  animalId: string,
  animalData: UpdateAnimalSchema
): Promise<void> {
  console.log('Entering updateAnimalCommand...');

  // First, verify the animal exists and belongs to the user
  if (!(await doesAnimalExistCommand(userId, animalId))) {
    throw new HttpResponseError(
      404,
      'Animal not found or does not belong to user'
    );
  }

  // Build update object dynamically
  const updateData: any = {};

  if (animalData.name !== undefined) {
    updateData.name = animalData.name;
  }

  if (animalData.gender !== undefined) {
    updateData.gender = animalData.gender;
  }

  if (animalData.ageInWeeks !== undefined) {
    updateData.ageInWeeks = animalData.ageInWeeks;
  }

  if (animalData.neutered !== undefined) {
    updateData.neutered = animalData.neutered;
  }

  if (animalData.addressDisplayName !== undefined) {
    updateData.addressDisplayName = animalData.addressDisplayName;
  }

  if (animalData.description !== undefined) {
    updateData.description = animalData.description;
  }

  // Handle address separately since it needs special PostGIS syntax
  if (animalData.address !== undefined) {
    const { latitude, longitude } = animalData.address;
    const point = `ST_MakePoint(${longitude}, ${latitude})`;
    // For address, we need to use raw SQL
    updateData.address = sql`ST_SetSRID(${sql.raw(point)}, 4326)::geography`;
  }

  // Always update last_updated_at timestamp
  updateData.lastUpdatedAt = sql`NOW()`;

  // If no fields to update (should be caught by validator, but just in case)
  if (Object.keys(updateData).length === 0) {
    console.log('No fields to update');
    return;
  }

  // Execute the update using drizzle ORM
  const result = await db
    .update(animals)
    .set(updateData)
    .where(sql`animal_id = ${animalId} AND rehomer_id = ${userId}`)
    .returning();

  if (result.length < 1) {
    const baseErrorMsg = 'Failed to update animal';
    console.error(`${baseErrorMsg} with ID ${animalId} for user ${userId}`);
    throw new HttpResponseError(500, baseErrorMsg);
  }

  console.log(`Successfully updated animal with ID ${animalId}`);
}
