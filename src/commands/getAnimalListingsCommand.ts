import { eq, sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import {
  animalListingsValidator,
  type AnimalListingsSchema
} from '../validators/database/animalListingsValidator';

export type GetAnimalListingsCommandResponse = Promise<{
  success: boolean;
  data?: AnimalListingsSchema;
  errorMsg?: string;
  totalResults?: number;
  page?: number;
  pageSize?: number;
}>;

/**
 *
 * @param userId The ID of the user whose animal listings should be fetched
 * @param page The page number (1-indexed)
 * @param pageSize The number of items per page
 * @returns A {@link GetAnimalListingsCommandResponse}
 */
export async function getAnimalListingsCommand(
  userId: string,
  page: number,
  pageSize: number
): GetAnimalListingsCommandResponse {
  try {
    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Get total count
    const recordCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(animals)
      .where(eq(animals.rehomerId, userId));
    const totalResults = +(recordCount[0]?.count ?? 0);

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
        totalResults,
        page,
        pageSize
      };
    } else {
      return {
        success: false,
        errorMsg: validationResult.error.issues
          .map((issue) => issue.message)
          .join('\n'),
        totalResults,
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
