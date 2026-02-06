import deleteAnimalsForRehomerCommand from '../commands/deleteAnimalsForRehomerCommand';

/**
 * Deletes an animal listing
 * @param userId The ID of the rehomer
 */
export async function deleteAnimalsForRehomerAction(
  userId: string
): Promise<void> {
  console.log('Entering DeleteAnimalsForRehomerAction...');

  await deleteAnimalsForRehomerCommand(userId);

  console.log(
    `Deleted all animals for user ${userId}\nExiting DeleteAnimalsForRehomerAction...`
  );
}
