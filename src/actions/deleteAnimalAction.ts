import deleteAnimalCommand from '../commands/deleteAnimalCommand';

/**
 * Deletes an animal listing
 * @param userId The ID of the animal's owner
 * @param animalId The ID of the animal to delete
 */
export async function deleteAnimalAction(
  userId: string,
  animalId: string
): Promise<void> {
  console.log('Entering deleteAnimalAction...');

  await deleteAnimalCommand(userId, animalId);

  console.log(
    `Deleted animal ${animalId} for user ${userId}\nExiting deleteAnimalAction...`
  );
}
