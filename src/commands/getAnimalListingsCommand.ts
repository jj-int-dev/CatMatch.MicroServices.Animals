import { eq, sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import {
  animalListingsValidator,
  type AnimalListingsSchema
} from '../validators/database/animalListingsValidator';

/**
 *
 * @param userId The ID of the user whose animal listings should be fetched
 * @param page The page number (1-indexed)
 * @param pageSize The number of items per page
 * @returns An object containing the animal listings if they exist, along with pagination metadata
 */
export default async function (
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{
  success: boolean;
  data?: AnimalListingsSchema;
  error?: unknown;
  total?: number;
  page?: number;
  pageSize?: number;
}> {
  try {
    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(animals)
      .where(eq(animals.rehomerId, userId));
    const total = Number(totalResult[0]?.count ?? 0);

    // Get paginated results
    const result = await db.query.animals.findMany({
      columns: {
        animalId: true,
        name: true,
        gender: true,
        ageInWeeks: true,
        neutered: true,
        addressDisplayName: true,
        description: true,
        createdAt: true
      },
      with: {
        animalPhotos: {
          columns: { photoUrl: true, order: true },
          orderBy: (animalPhotos, { asc }) => [asc(animalPhotos.order)]
        }
      },
      where: eq(animals.rehomerId, userId),
      orderBy: (animals, { desc }) => [desc(animals.createdAt)],
      limit: pageSize,
      offset: offset
    });

    const validationResult = animalListingsValidator.safeParse(result);

    if (validationResult.success) {
      return {
        success: true,
        data: validationResult.data,
        total,
        page,
        pageSize
      };
    } else {
      return {
        success: false,
        error: validationResult.error,
        total,
        page,
        pageSize
      };
    }
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}
