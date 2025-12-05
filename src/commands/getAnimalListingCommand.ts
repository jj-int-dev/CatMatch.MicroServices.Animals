import { eq, and } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import {
  animalListingValidator,
  type AnimalListingSchema
} from '../validators/database/animalListingValidator';
import type { ZodSafeParseResult } from 'zod';

export type GetAnimalListingCommandResponse = Promise<
  ZodSafeParseResult<AnimalListingSchema>
>;

/**
 *
 * @param userId The ID of the user whose animal listing should be fetched
 * @param animalId The ID of the animal listing to fetch
 * @returns A {@link GetAnimalListingCommandResponse}
 */
export async function getAnimalListingCommand(
  userId: string,
  animalId: string
): GetAnimalListingCommandResponse {
  return animalListingValidator.safeParse(
    await db.query.animals.findFirst({
      columns: {
        animalId: true,
        name: true,
        gender: true,
        ageInWeeks: true,
        neutered: true,
        addressDisplayName: true,
        description: true,
        createdAt: true
      },
      with: {
        animalPhotos: {
          columns: { photoUrl: true, order: true },
          orderBy: (animalPhotos, { asc }) => [asc(animalPhotos.order)]
        }
      },
      where: and(eq(animals.rehomerId, userId), eq(animals.animalId, animalId))
    })
  );
}
