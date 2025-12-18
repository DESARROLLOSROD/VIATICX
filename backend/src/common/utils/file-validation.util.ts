import { BadRequestException } from '@nestjs/common';
import * as path from 'path';

/**
 * Allowed MIME types for file uploads
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
] as const;

/**
 * Maximum file size in bytes (10MB default)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Allowed file extensions
 */
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'] as const;

/**
 * Validate file MIME type
 * @param mimetype - File MIME type
 * @returns True if valid, throws BadRequestException if invalid
 */
export function validateMimeType(mimetype: string): boolean {
  if (!ALLOWED_MIME_TYPES.includes(mimetype as any)) {
    throw new BadRequestException(
      `Tipo de archivo no permitido. Tipos permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }
  return true;
}

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSize - Maximum size in bytes (optional, defaults to MAX_FILE_SIZE)
 * @returns True if valid, throws BadRequestException if invalid
 */
export function validateFileSize(size: number, maxSize: number = MAX_FILE_SIZE): boolean {
  if (size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw new BadRequestException(
      `El archivo es demasiado grande. Tamaño máximo permitido: ${maxSizeMB}MB`
    );
  }
  return true;
}

/**
 * Validate file extension
 * @param filename - File name
 * @returns True if valid, throws BadRequestException if invalid
 */
export function validateFileExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext as any)) {
    throw new BadRequestException(
      `Extensión de archivo no permitida. Extensiones permitidas: ${ALLOWED_EXTENSIONS.join(', ')}`
    );
  }

  return true;
}

/**
 * Comprehensive file validation
 * @param file - Express.Multer.File object
 * @returns True if all validations pass
 */
export function validateUploadedFile(file: Express.Multer.File): boolean {
  if (!file) {
    throw new BadRequestException('No se proporcionó ningún archivo');
  }

  validateMimeType(file.mimetype);
  validateFileSize(file.size);
  validateFileExtension(file.originalname);

  return true;
}

/**
 * Generate safe filename
 * @param originalname - Original file name
 * @returns Safe filename with random prefix
 */
export function generateSafeFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase();
  const timestamp = Date.now();
  const randomString = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  return `${timestamp}-${randomString}${ext}`;
}

/**
 * Multer file filter
 */
export const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) => {
  try {
    validateMimeType(file.mimetype);
    validateFileExtension(file.originalname);
    callback(null, true);
  } catch (error) {
    callback(error as Error, false);
  }
};
