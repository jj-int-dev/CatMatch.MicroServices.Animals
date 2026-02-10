import { updateAnimalPhotosCommand } from '../commands/updateAnimalPhotosCommand';

/**
 * Updates photos for an existing animal
 * @param userId The ID of the user who owns the animal
 * @param animalId The ID of the animal to update photos for
 * @param files The new photos to add
 * @param photoUrlsToDelete The URLs of existing photos to delete
 * @throws A {@link HttpResponseError} If an error occurred while updating photos for the animal listing
 */
export async function updateAnimalPhotosAction(
  userId: string,
  animalId: string,
  files: Express.Multer.File[],
  photoUrlsToDelete: string[] = []
): Promise<void> {
  console.log('Entering updateAnimalPhotosAction...');

  await updateAnimalPhotosCommand(userId, animalId, files, photoUrlsToDelete);

  console.log(
    `Successfully updated photos for animal listing with animalId ${animalId} for user with userId ${userId}\nExiting updateAnimalPhotosAction...`
  );
}
