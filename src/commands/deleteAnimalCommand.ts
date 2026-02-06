import { ANIMAL_PICTURES_STORAGE_BUCKET } from '../utils/constants';
import { supabase } from '../utils/supabaseClient';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import { and, eq } from 'drizzle-orm';

/**
 * @param userId The ID of the owner of the animal to delete
 * @param animalId The ID of the animal to delete
 */
export default async function (
  userId: string,
  animalId: string
): Promise<void> {
  const { data } = await supabase.storage
    .from(ANIMAL_PICTURES_STORAGE_BUCKET)
    .list(animalId);

  // delete animal photos from storage
  if (data && data.length > 0) {
    await supabase.storage
      .from(ANIMAL_PICTURES_STORAGE_BUCKET)
      .remove(data.map((file) => `${animalId}/${file.name}`));
  }

  // delete animal photos and animal from db. foreign key cascading will
  // cause any animal photos with this animal's ID to be deleted
  await db
    .delete(animals)
    .where(and(eq(animals.animalId, animalId), eq(animals.rehomerId, userId)));
}
