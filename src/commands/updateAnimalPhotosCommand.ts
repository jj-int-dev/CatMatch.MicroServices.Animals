import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { supabase } from '../utils/supabaseClient';
import HttpResponseError from '../dtos/httpResponseError';
import doesAnimalExistCommand from './doesAnimalExistCommand';
import { ANIMAL_PICTURES_STORAGE_BUCKET } from '../utils/constants';

/**
 * Updates animal photos in storage and database
 * @param userId The ID of the user (rehomer) who owns the animal
 * @param animalId The ID of the animal to update photos for
 * @param files The new photos to replace existing ones
 * @throws A {@link HttpResponseError} If an error occurred while updating the animal photos
 */
export async function updateAnimalPhotosCommand(
  userId: string,
  animalId: string,
  files: Express.Multer.File[]
): Promise<void> {
  console.log('Entering updateAnimalPhotosCommand...');

  // Backup original photos before making changes
  let originalPhotos: Array<{
    fileName: string;
    photoUrl: string;
    order: number;
  }> = [];
  const uploadedFiles: string[] = [];

  try {
    // First, verify the animal exists and belongs to the user
    if (!(await doesAnimalExistCommand(userId, animalId))) {
      throw new Error('Animal not found or does not belong to user');
    }

    // Get existing photos from database to backup
    const existingPhotosResult = await db.execute(sql`
      SELECT photo_url, "order" FROM animal_photos 
      WHERE animal_id = ${animalId}
      ORDER BY "order" ASC
    `);

    // Extract file names from photo URLs for backup
    for (const row of existingPhotosResult) {
      const photoUrl = row['photo_url'] as string;
      const order = row['order'] as number;

      // Extract file name from URL (assuming Supabase storage URL pattern)
      const fileName = extractFileNameFromUrl(photoUrl);
      if (fileName) {
        originalPhotos.push({ fileName, photoUrl, order });
      }
    }

    // Delete existing photos from database (we'll re-insert new ones)
    await db.execute(sql`
      DELETE FROM animal_photos 
      WHERE animal_id = ${animalId}
    `);

    // Upload new files to Supabase storage and insert into database
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const fileExtension = file.originalname?.split('.').pop() || 'jpg';
      const fileName = `${animalId}/${Date.now()}-${i}.${fileExtension}`;

      // Upload to Supabase storage
      const { error } = await supabase.storage
        .from(ANIMAL_PICTURES_STORAGE_BUCKET)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        throw new Error(
          `Failed to upload file ${file.originalname}: ${error.message}`
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(ANIMAL_PICTURES_STORAGE_BUCKET)
        .getPublicUrl(fileName);

      // Add to list of successfully uploaded files
      uploadedFiles.push(fileName);

      // Insert photo url and order into the database
      await db.execute(sql`
        INSERT INTO animal_photos (
          animal_id,
          photo_url,
          "order"
        ) VALUES (
          ${animalId},
          ${urlData.publicUrl},
          ${i}
        )
      `);
    }

    // If successful, delete old photos from storage
    for (const photo of originalPhotos) {
      try {
        const result = await supabase.storage
          .from(ANIMAL_PICTURES_STORAGE_BUCKET)
          .remove([photo.fileName]);
        if (result.error) {
          console.error(
            `Failed to delete old file ${photo.fileName}:`,
            result.error
          );
          // Continue with cleanup even if some deletions fail
        } else {
          console.log(`Deleted old photo: ${photo.fileName}`);
        }
      } catch (error) {
        console.error(`Error deleting old file ${photo.fileName}:`, error);
      }
    }

    console.log(`Successfully updated photos for animal with ID ${animalId}`);
  } catch (error) {
    const baseErrorMsg = 'Error trying to update animal photos';
    console.error(`${baseErrorMsg}:`, error);

    // Cleanup: restore original state
    console.log('Attempting to restore original state after error...');

    // 1. Clean up any newly uploaded files
    await cleanupUploadedFiles(uploadedFiles);

    // 2. Restore original photos in database
    await restoreOriginalPhotos(animalId, originalPhotos);

    throw new HttpResponseError(500, baseErrorMsg);
  }
}

/**
 * Extract file name from Supabase storage URL
 */
function extractFileNameFromUrl(url: string): string | null {
  try {
    // Supabase storage URL pattern: https://[project].supabase.co/storage/v1/object/public/animals/[fileName]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const animalsIndex = pathParts.indexOf('animals');
    if (animalsIndex !== -1 && animalsIndex + 1 < pathParts.length) {
      return pathParts.slice(animalsIndex + 1).join('/');
    }
  } catch (error) {
    console.error(`Failed to parse URL ${url}:`, error);
  }
  return null;
}

/**
 * Clean up uploaded files from Supabase storage
 */
async function cleanupUploadedFiles(files: string[]): Promise<void> {
  if (files.length === 0) return;
  for (const file of files) {
    try {
      const result = await supabase.storage
        .from(ANIMAL_PICTURES_STORAGE_BUCKET)
        .remove([file]);
      if (result.error) {
        console.error(`Failed to clean up file ${file}:`, result.error);
      } else {
        console.log(`Cleaned up uploaded file: ${file}`);
      }
    } catch (error) {
      console.error(`Failed to clean up file ${file}:`, error);
    }
  }
}

/**
 * Restore original photos to database
 */
async function restoreOriginalPhotos(
  animalId: string,
  originalPhotos: Array<{ fileName: string; photoUrl: string; order: number }>
): Promise<void> {
  try {
    // First, clear any photos that might have been inserted
    await db.execute(sql`
      DELETE FROM animal_photos 
      WHERE animal_id = ${animalId}
    `);

    // Then re-insert original photos
    for (const photo of originalPhotos) {
      await db.execute(sql`
        INSERT INTO animal_photos (
          animal_id,
          photo_url,
          "order"
        ) VALUES (
          ${animalId},
          ${photo.photoUrl},
          ${photo.order}
        )
      `);
    }

    console.log(`Restored original photos for animal: ${animalId}`);
  } catch (error) {
    console.error(
      `Failed to restore original photos for animal ${animalId}:`,
      error
    );
  }
}
