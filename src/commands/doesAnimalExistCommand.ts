import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';

/**
 * Checks if an animal exists and belongs to the specified user
 */
export default async function (
  userId: string,
  animalId: string
): Promise<boolean> {
  const animalCheck = await db.execute(sql`
    SELECT animal_id FROM animals 
    WHERE animal_id = ${animalId} AND rehomer_id = ${userId}
  `);
  const rows = Array.isArray(animalCheck) ? animalCheck : [];
  return rows.length > 0;
}
