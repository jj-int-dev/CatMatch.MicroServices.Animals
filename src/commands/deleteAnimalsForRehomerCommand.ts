import { ANIMAL_PICTURES_STORAGE_BUCKET } from '../utils/constants';
import { supabase } from '../utils/supabaseClient';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import { and, eq, inArray } from 'drizzle-orm';

/**
 * @param userId The ID of the owner of the animals to delete
 */
export default async function (userId: string): Promise<void> {
  const animalIdRecords = await db.query.animals.findMany({
    columns: { animalId: true },
    where: eq(animals.rehomerId, userId)
  });
  const animalIds = animalIdRecords.map((record) => record.animalId);
  const filesToDelete: string[] = [];

  for (const animalId of animalIds) {
    const { data } = await supabase.storage
      .from(ANIMAL_PICTURES_STORAGE_BUCKET)
      .list(animalId);

    if (data && data.length > 0) {
      filesToDelete.push(...data.map((file) => `${animalId}/${file.name}`));
    }
  }

  // delete animal photos from storage
  await supabase.storage
    .from(ANIMAL_PICTURES_STORAGE_BUCKET)
    .remove(filesToDelete);

  // delete animal photos and  animal from db. foreign key cascading will
  // cause any animal photos with these animals' IDs to be deleted
  await db
    .delete(animals)
    .where(
      and(eq(animals.rehomerId, userId), inArray(animals.animalId, animalIds))
    );
}
