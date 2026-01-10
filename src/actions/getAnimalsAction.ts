import { getAnimalsCommand } from '../commands/getAnimalsCommand';
import type { AnimalsSchema } from '../validators/database/animalsValidator';
import HttpResponseError from '../dtos/httpResponseError';

export type GetAnimalsActionResponse = Promise<{
  animals: AnimalsSchema;
  pagination: {
    totalResults: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}>;

/**
 *
 * @param userId The ID of the user whose animal listings should be fetched
 * @param page The page number (1-indexed)
 * @param pageSize The number of items per page
 * @returns A {@link GetAnimalsActionResponse} containing the animals and pagination metadata
 * @throws A {@link HttpResponseError} If an error occurred while fetching the animals from the database
 */
export async function getAnimalsAction(
  userId: string,
  page: number,
  pageSize: number
): GetAnimalsActionResponse {
  console.log('Entering GetAnimalsAction ...');
  const {
    success,
    data,
    errorMsg,
    totalResults,
    page: resultPage,
    pageSize: resultPageSize
  } = await getAnimalsCommand(userId, page, pageSize);

  if (success && data) {
    const totalPages = Math.ceil(
      (totalResults || 0) / (resultPageSize || pageSize)
    );

    console.log(
      `Successfully retrieved ${data.length} animal listings for user with userId ${userId} (page ${resultPage || page}, size ${resultPageSize || pageSize})\nExiting GetAnimalsAction ...`
    );

    return {
      animals: data,
      pagination: {
        totalResults: totalResults || 0,
        page: resultPage || page,
        pageSize: resultPageSize || pageSize,
        totalPages
      }
    };
  }

  const baseErrorMsg = `Error occurred while fetching animal listings for user ${userId}`;
  const moreDetails = errorMsg ? `: ${errorMsg}` : '';
  console.error(`${baseErrorMsg}${moreDetails}`);
  throw new HttpResponseError(500, baseErrorMsg);
}
