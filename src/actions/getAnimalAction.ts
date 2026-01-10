import { getAnimalCommand } from '../commands/getAnimalCommand';
import type { AnimalSchema } from '../validators/database/animalValidator';
import HttpResponseError from '../dtos/httpResponseError';

export type GetAnimalActionResponse = Promise<AnimalSchema>;

/**
 *
 * @param userId The ID of the user whose animal listing should be fetched
 * @param animalId The ID of the animal listing to fetch
 * @returns A {@link GetAnimalActionResponse}
 * @throws A {@link HttpResponseError} If an error occurred while fetching the animal listing from the database
 */
export async function getAnimalAction(
  userId: string,
  animalId: string
): GetAnimalActionResponse {
  console.log('Entering GetAnimalAction ...');
  const { success, data, error } = await getAnimalCommand(userId, animalId);

  if (success) {
    if (data) {
      console.log(
        `Successfully retrieved animal listing with animalId ${animalId} for user with userId ${userId}\nExiting GetAnimalAction ...`
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
