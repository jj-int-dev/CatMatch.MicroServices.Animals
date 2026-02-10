import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  MAX_FILE_SIZE_BYTES,
  ALLOWED_ANIMAL_PHOTO_TYPE
} from '../../utils/constants';

const isFileMimeTypeValid = (file: Express.Multer.File) =>
  file.mimetype.split('/').at(-1) === ALLOWED_ANIMAL_PHOTO_TYPE;

// Configure multer for file upload
const upload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter: (req, file, cb) => {
    // Check if file type is allowed
    if (isFileMimeTypeValid(file)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed type: ${ALLOWED_ANIMAL_PHOTO_TYPE}`
        )
      );
    }
  }
}).array('photos', 5); // 'photos' field name, max 5 files

export function updateAnimalPhotosValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload(req, res, (err) => {
    if (err) {
      console.log(`File upload validation error: ${err.message}`);

      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: `File size exceeds limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            message: 'Maximum 5 photos allowed'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            message: 'Unexpected file field. Use "photos" as field name'
          });
        }
      }

      // Generic error
      return res.status(400).json({
        message: err.message || 'File upload validation failed'
      });
    }

    // Check if files were uploaded - allow empty array (0 photos)
    const files = Array.isArray(req.files) ? req.files : [];

    // Extract and validate photoUrlsToDelete from FormData
    let photoUrlsToDelete: string[] = [];
    if (req.body.photoUrlsToDelete) {
      try {
        const parsed = JSON.parse(req.body.photoUrlsToDelete);
        if (Array.isArray(parsed)) {
          // Validate each URL is a string
          for (const url of parsed) {
            if (typeof url !== 'string') {
              return res.status(400).json({
                message: 'photoUrlsToDelete must contain only strings'
              });
            }
          }
          photoUrlsToDelete = parsed;
        } else {
          return res.status(400).json({
            message: 'photoUrlsToDelete must be an array'
          });
        }
      } catch (error) {
        return res.status(400).json({
          message: 'Invalid photoUrlsToDelete format. Must be valid JSON array.'
        });
      }
    }

    // Store photoUrlsToDelete in req.body for action to access
    req.body.photoUrlsToDelete = photoUrlsToDelete;

    // If no files and no deletions, that's still OK
    if (files.length === 0 && photoUrlsToDelete.length === 0) {
      return next();
    }

    // Validate file count doesn't exceed limit
    if (files.length > 5) {
      return res.status(400).json({
        message: 'Maximum 5 photos allowed'
      });
    }

    // Validate each file
    for (const file of files) {
      if (!isFileMimeTypeValid(file)) {
        return res.status(400).json({
          message: `Invalid file type: ${file.mimetype}. Allowed type: ${ALLOWED_ANIMAL_PHOTO_TYPE}`
        });
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return res.status(400).json({
          message: `File ${file.originalname} exceeds size limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`
        });
      }
    }

    return next();
  });
}
