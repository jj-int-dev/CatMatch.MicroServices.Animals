import { getAdoptableAnimalCommand } from '../commands/getAdoptableAnimalCommand';
import HttpResponseError from '../dtos/httpResponseError';
import {
  toAdoptableAnimal,
  type AdoptableAnimal
} from '../mappers/adoptableAnimalSchemaToAdoptableAnimal';

/**
 * @param animalId The ID of the adoptable animal to fetch
 * @returns A {@link GetAdoptableAnimalActionResponse}
 * @throws A {@link HttpResponseError} If an error occurred while fetching the adoptable animal from the database
 */
export async function getAdoptableAnimalAction(
  animalId: string
): Promise<AdoptableAnimal> {
  console.log('Entering GetAdoptableAnimalAction ...');
  const { success, data, error } = await getAdoptableAnimalCommand(animalId);

  if (success) {
    if (data) {
      console.log(
        `Successfully retrieved adoptable animal with animalId ${animalId}\nExiting GetAdoptableAnimalAction ...`
      );
      return toAdoptableAnimal(data);
    } else {
      throw new HttpResponseError(
        404,
        `Adoptable animal with animalId ${animalId} not found`
      );
    }
  }

  const errorMsg = `Error occurred while fetching adoptable animal with animalId ${animalId}`;
  const moreDetails = error?.message ? `: ${error.message}` : '';
  console.error(`${errorMsg}${moreDetails}`);
  throw new HttpResponseError(500, errorMsg);
}
