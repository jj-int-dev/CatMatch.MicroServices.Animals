import getAnimalListingsCommand from '../commands/getAnimalListingsCommand';
import type { AnimalListingsSchema } from '../validators/database/animalListingsValidator';
import HttpResponseError from '../dtos/httpResponseError';

/**
 *
 * @param userId The ID of the user whose animal listings should be fetched
 * @param page The page number (1-indexed)
 * @param pageSize The number of items per page
 * @returns An object containing the animal listings and pagination metadata
 * @throws {HttpResponseError} If an error occurred while fetching the animal listings from the database
 */
export default async function (
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{
  animals: AnimalListingsSchema;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}> {
  console.log('Entering GetAnimalListingsAction ...');
  const {
    success,
    data,
    error,
    total,
    page: resultPage,
    pageSize: resultPageSize
  } = await getAnimalListingsCommand(userId, page, pageSize);

  if (success && data) {
    const totalPages = Math.ceil((total || 0) / (resultPageSize || pageSize));

    console.log(
      `Successfully retrieved ${data.length} animal listings for user with userId ${userId} (page ${resultPage || page}, size ${resultPageSize || pageSize})\nExiting GetAnimalListingsAction ...`
    );

    return {
      animals: data,
      pagination: {
        total: total || 0,
        page: resultPage || page,
        pageSize: resultPageSize || pageSize,
        totalPages
      }
    };
  }

  const errorMsg = `Error occurred while fetching animal listings for user ${userId}`;
  const moreDetails =
    error && typeof error === 'object' && 'message' in error
      ? `: ${(error as any).message}`
      : '';
  console.error(`${errorMsg}${moreDetails}`);
  throw new HttpResponseError(500, errorMsg);
}
