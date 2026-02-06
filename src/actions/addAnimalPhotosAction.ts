import { addAnimalPhotosCommand } from '../commands/addAnimalPhotosCommand';

/**
 * Adds photos for an existing animal
 * @param userId The ID of the user who owns the animal
 * @param animalId The ID of the animal to add photos for
 * @param files The photos to add
 * @throws A {@link HttpResponseError} If an error occurred while adding photos to the animal listing
 */
export async function addAnimalPhotosAction(
  userId: string,
  animalId: string,
  files: Express.Multer.File[]
): Promise<void> {
  console.log('Entering addAnimalPhotosAction...');

  await addAnimalPhotosCommand(userId, animalId, files);

  console.log(
    `Successfully added photos to animal listing with animalId ${animalId} for user with userId ${userId}\nExiting addAnimalPhotosAction...`
  );
}
