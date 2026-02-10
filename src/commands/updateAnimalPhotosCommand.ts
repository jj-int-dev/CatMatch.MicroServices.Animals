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
 * @param files The new photos to add
 * @param photoUrlsToDelete The URLs of existing photos to delete
 * @throws A {@link HttpResponseError} If an error occurred while updating the animal photos
 */
export async function updateAnimalPhotosCommand(
  userId: string,
  animalId: string,
  files: Express.Multer.File[],
  photoUrlsToDelete: string[] = []
): Promise<void> {
  console.log('Entering updateAnimalPhotosCommand...');
  console.log(`Photos to delete: ${JSON.stringify(photoUrlsToDelete)}`);
  console.log(`New files to upload: ${files.length}`);

  // Backup for rollback in case of errors
  let originalPhotos: Array<{
    fileName: string;
    photoUrl: string;
    order: number;
  }> = [];
  const uploadedFiles: string[] = [];
  const deletedPhotos: Array<{
    fileName: string;
    photoUrl: string;
    order: number;
  }> = [];

  try {
    // First, verify the animal exists and belongs to the user
    if (!(await doesAnimalExistCommand(userId, animalId))) {
      throw new Error('Animal not found or does not belong to user');
    }

    // Get all existing photos from database
    const existingPhotosResult = await db.execute(sql`
      SELECT photo_url, "order" FROM animal_photos 
      WHERE animal_id = ${animalId}
      ORDER BY "order" ASC
    `);

    // Backup all existing photos
    for (const row of existingPhotosResult) {
      const photoUrl = row['photo_url'] as string;
      const order = row['order'] as number;
      const fileName = extractFileNameFromUrl(photoUrl);
      if (fileName) {
        originalPhotos.push({ fileName, photoUrl, order });
      }
    }

    // Step 1: Delete photos marked for deletion
    for (const photoUrlToDelete of photoUrlsToDelete) {
      const fileName = extractFileNameFromUrl(photoUrlToDelete);
      if (!fileName) {
        console.warn(
          `Could not extract filename from URL: ${photoUrlToDelete}`
        );
        continue;
      }

      // Delete from database
      await db.execute(sql`
        DELETE FROM animal_photos 
        WHERE animal_id = ${animalId} AND photo_url = ${photoUrlToDelete}
      `);

      // Delete from storage
      const { error } = await supabase.storage
        .from(ANIMAL_PICTURES_STORAGE_BUCKET)
        .remove([fileName]);

      if (error) {
        throw new Error(`Failed to delete photo ${fileName}: ${error.message}`);
      }

      // Track deleted photos for potential rollback
      const deletedPhoto = originalPhotos.find(
        (p) => p.photoUrl === photoUrlToDelete
      );
      if (deletedPhoto) {
        deletedPhotos.push(deletedPhoto);
      }

      console.log(`Deleted photo: ${fileName}`);
    }

    // Step 2: Get remaining photos to determine next order value
    const remainingPhotosResult = await db.execute(sql`
      SELECT photo_url, "order" FROM animal_photos 
      WHERE animal_id = ${animalId}
      ORDER BY "order" ASC
    `);

    let nextOrder = remainingPhotosResult.length;

    // Step 3: Upload new files
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
          ${nextOrder}
        )
      `);

      console.log(`Uploaded new photo: ${fileName} with order ${nextOrder}`);
      nextOrder++;
    }

    console.log(`Successfully updated photos for animal with ID ${animalId}`);
  } catch (error) {
    const baseErrorMsg = 'Error trying to update animal photos';
    console.error(`${baseErrorMsg}:`, error);

    // Cleanup: restore original state
    console.log('Attempting to restore original state after error...');

    // 1. Clean up any newly uploaded files
    await cleanupUploadedFiles(uploadedFiles);

    // 2. Restore deleted photos
    await restoreDeletedPhotos(animalId, deletedPhotos);

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
 * Restore deleted photos to database (rollback on error)
 */
async function restoreDeletedPhotos(
  animalId: string,
  deletedPhotos: Array<{ fileName: string; photoUrl: string; order: number }>
): Promise<void> {
  if (deletedPhotos.length === 0) return;

  try {
    // Re-insert deleted photos
    for (const photo of deletedPhotos) {
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
        ON CONFLICT DO NOTHING
      `);
    }

    console.log(
      `Restored ${deletedPhotos.length} deleted photos for animal: ${animalId}`
    );
  } catch (error) {
    console.error(
      `Failed to restore deleted photos for animal ${animalId}:`,
      error
    );
  }
}
