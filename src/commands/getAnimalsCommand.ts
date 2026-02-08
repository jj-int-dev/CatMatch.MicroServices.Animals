import { eq, sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { animals } from '../database-migrations/schema';
import {
  animalsValidator,
  type AnimalsSchema
} from '../validators/database/animalsValidator';

export type GetAnimalsCommandResponse = Promise<{
  success: boolean;
  data?: AnimalsSchema;
  errorMsg?: string;
  totalResults?: number;
  page?: number;
  pageSize?: number;
}>;

/**
 *
 * @param userId The ID of the user whose animal listings should be fetched
 * @param page The page number (1-indexed)
 * @param pageSize The number of items per page
 * @returns A {@link GetAnimalsCommandResponse}
 */
export async function getAnimalsCommand(
  userId: string,
  page: number,
  pageSize: number
): GetAnimalsCommandResponse {
  try {
    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Get total count
    const recordCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(animals)
      .where(eq(animals.rehomerId, userId));
    const totalResults = +(recordCount[0]?.count ?? 0);

    // Get paginated results
    const records = await db.execute(sql`
      SELECT
        a.animal_id AS animalId,
        a.name,
        a.gender,
        a.age_in_weeks AS ageInWeeks,
        a.neutered,
        a.address_display_name AS addressDisplayName,
        a.description,
        created_at AS createdAt,
        ST_Y(a.address::geometry) AS addressLatitude,
        ST_X(a.address::geometry) AS addressLongitude,
        json_agg(
          json_build_object('photoUrl', ap.photo_url, 'order', ap.order)
          ORDER BY ap.order ASC
        ) FILTER (WHERE ap.photo_url IS NOT NULL) AS animal_photos
      FROM animals a
      LEFT JOIN animal_photos ap ON a.animal_id = ap.animal_id
      WHERE a.rehomer_id = ${userId}
      GROUP BY a.animal_id, a.name, a.gender, a.age_in_weeks, a.neutered, a.address_display_name, a.description, a.created_at, a.address
      ORDER BY a.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset};
    `);

    const validationResult = animalsValidator.safeParse(records);

    if (validationResult.success) {
      return {
        success: true,
        data: validationResult.data,
        totalResults,
        page,
        pageSize
      };
    } else {
      return {
        success: false,
        errorMsg: validationResult.error.issues
          .map((issue) => issue.message)
          .join('\n'),
        totalResults,
        page,
        pageSize
      };
    }
  } catch (error) {
    return {
      success: false,
      errorMsg: (error as Error).message
    };
  }
}
