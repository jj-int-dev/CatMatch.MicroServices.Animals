import { updateAnimalPhotosCommand } from '../commands/updateAnimalPhotosCommand';
import HttpResponseError from '../dtos/httpResponseError';

/**
 * Updates photos for an existing animal
 * @param userId The ID of the user who owns the animal
 * @param animalId The ID of the animal to update photos for
 * @param files The new photos to replace existing ones
 * @throws A {@link HttpResponseError} If an error occurred while updating photos for the animal listing
 */
export async function updateAnimalPhotosAction(
  userId: string,
  animalId: string,
  files: Express.Multer.File[]
): Promise<void> {
  console.log('Entering updateAnimalPhotosAction...');

  await updateAnimalPhotosCommand(userId, animalId, files);

  console.log(
    `Successfully updated photos for animal listing with animalId ${animalId} for user with userId ${userId}\nExiting updateAnimalPhotosAction...`
  );
}
