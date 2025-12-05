import { getAnimalListingCommand } from '../commands/getAnimalListingCommand';
import type { AnimalListingSchema } from '../validators/database/animalListingValidator';
import HttpResponseError from '../dtos/httpResponseError';

export type GetAnimalListingActionResponse = Promise<AnimalListingSchema>;

/**
 *
 * @param userId The ID of the user whose animal listing should be fetched
 * @param animalId The ID of the animal listing to fetch
 * @returns A {@link GetAnimalListingActionResponse}
 * @throws A {@link HttpResponseError} If an error occurred while fetching the animal listing from the database
 */
export async function getAnimalListingAction(
  userId: string,
  animalId: string
): GetAnimalListingActionResponse {
  console.log('Entering GetAnimalListingAction ...');
  const { success, data, error } = await getAnimalListingCommand(
    userId,
    animalId
  );

  if (success) {
    if (data) {
      console.log(
        `Successfully retrieved animal listing with animalId ${animalId} for user with userId ${userId}\nExiting GetAnimalListingAction ...`
      );
      return data;
    } else {
      const errorMsg = `Animal listing with animalId ${animalId} not found for user ${userId}`;
      console.error(errorMsg);
      throw new HttpResponseError(404, errorMsg);
    }
  }

  const errorMsg = `Error occurred while fetching animal listing with animalId ${animalId} for user ${userId}`;
  const moreDetails = error?.message ? `: ${error.message}` : '';
  console.error(`${errorMsg}${moreDetails}`);
  throw new HttpResponseError(500, errorMsg);
}
