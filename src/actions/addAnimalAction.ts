import { addAnimalCommand } from '../commands/addAnimalCommand';
import type { AddAnimalSchema } from '../validators/requests/addAnimalValidator';

/**
 * Adds a new animal listing
 * @param userId The ID of the user creating the animal
 * @param animalData The animal data to add
 */
export async function addAnimalAction(
  userId: string,
  animalData: AddAnimalSchema
): Promise<string> {
  console.log('Entering addAnimalAction...');
  const animalId = await addAnimalCommand(userId, animalData);

  console.log(
    `Successfully added animal data for user with userId ${userId}\nExiting addAnimalAction...`
  );

  return animalId;
}
