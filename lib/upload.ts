import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function saveImageLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}-${randomString}.${extension}`;

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Save file
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  // Return URL path
  return `/uploads/${filename}`;
}

export function isValidImageType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isValidImageSize(file: File, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}
