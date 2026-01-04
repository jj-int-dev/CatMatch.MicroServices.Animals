import { updateAnimalCommand } from '../commands/updateAnimalCommand';
import type { UpdateAnimalSchema } from '../validators/requests/updateAnimalValidator';

/**
 * Updates an existing animal listing
 * @param userId The ID of the user who owns the animal
 * @param animalId The ID of the animal to update
 * @param animalData The animal data to update
 */
export async function updateAnimalAction(
  userId: string,
  animalId: string,
  animalData: UpdateAnimalSchema
): Promise<void> {
  console.log('Entering updateAnimalAction...');
  await updateAnimalCommand(userId, animalId, animalData);

  console.log(
    `Successfully updated animal data for animal with animalId ${animalId} for user with userId ${userId}\nExiting updateAnimalAction...`
  );
}
