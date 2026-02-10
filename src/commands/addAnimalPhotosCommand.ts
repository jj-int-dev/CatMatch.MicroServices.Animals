import { sql } from 'drizzle-orm';
import { db } from '../utils/databaseClient';
import { supabase } from '../utils/supabaseClient';
import HttpResponseError from '../dtos/httpResponseError';
import doesAnimalExistCommand from './doesAnimalExistCommand';

/**
 * Uploads animal photos to storage and saves their urls in the database
 * @param userId The ID of the user (rehomer) who owns the animal
 * @param animalId The ID of the animal to add photos for
 * @param files The photos to add
 * @throws A {@link HttpResponseError} If an error occurred while saving the animal photos
 */
export async function addAnimalPhotosCommand(
  userId: string,
  animalId: string,
  files: Express.Multer.File[]
): Promise<void> {
  console.log('Entering addAnimalPhotosCommand...');

  // Track successfully uploaded files for cleanup
  const uploadedFiles: string[] = [];
  let animalExists = false;

  try {
    // First, verify the animal exists and belongs to the user
    if (!(await doesAnimalExistCommand(userId, animalId)))
      throw new Error(
        `Animal ${animalId} not found or does not belong to user ${userId}`
      );

    animalExists = true;

    // Upload each file to Supabase storage, and then insert its public URL into the database
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const fileExtension = file.originalname?.split('.').pop() || 'jpg';
      const fileName = `${animalId}/${Date.now()}-${i}.${fileExtension}`;

      // Upload to Supabase storage
      const { error } = await supabase.storage
        .from('animals')
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
        .from('animals')
        .getPublicUrl(fileName);

      // add to list of successfully uploaded files
      uploadedFiles.push(fileName);

      // insert photo url and order into the database
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
  } catch (error) {
    const baseErrorMsg = 'Error trying to upload animal photos';
    console.error(`${baseErrorMsg}:`, error);

    // Clean up any already uploaded files
    await cleanupUploadedFiles(uploadedFiles);
    // Clean up any inserted animal_photo records
    await cleanupInsertedPhotoRecords(animalId);
    // If animal exists, delete the animal record
    if (animalExists) {
      await deleteAnimalRecord(userId, animalId);
    }

    throw new HttpResponseError(500, baseErrorMsg);
  }
}

/**
 * Clean up uploaded files from Supabase storage
 */
async function cleanupUploadedFiles(files: string[]): Promise<void> {
  if (files.length === 0) return;
  for (const file of files) {
    try {
      const result = await supabase.storage.from('animals').remove([file]);

      if (result.error) throw new Error(result.error.message);

      console.log(`Cleaned up uploaded file: ${file}`);
    } catch (error) {
      console.error(`Failed to clean up file ${file}:`, error);
    }
  }
  files.length = 0; // Clear the array after attempting cleanup
}

/**
 * Clean up animal_photo records from the database
 */
async function cleanupInsertedPhotoRecords(animalId: string): Promise<void> {
  try {
    await db.execute(sql`
      DELETE FROM animal_photos 
      WHERE animal_id = ${animalId}
    `);
    console.log(`Cleaned up animal_photo records for animal: ${animalId}`);
  } catch (error) {
    console.error(
      `Failed to clean up animal_photo records for animal ${animalId}:`,
      error
    );
  }
}

/**
 * Deletes the animal record from the database
 */
async function deleteAnimalRecord(
  userId: string,
  animalId: string
): Promise<void> {
  try {
    await db.execute(sql`
      DELETE FROM animals 
      WHERE animal_id = ${animalId} AND rehomer_id = ${userId}
    `);
    console.log(`Cleaned up animal record ${animalId} for user ${userId}`);
  } catch (error) {
    console.error(
      `Failed to delete animal record ${animalId} for user ${userId}:`,
      error
    );
  }
}
