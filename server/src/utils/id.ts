import { randomUUID } from 'crypto';

/**
 * Generates a unique identifier using UUID v4
 * @returns A string containing a UUID v4
 */
export function generateId(): string {
  return randomUUID();
}

/**
 * Validates if a string is a valid UUID v4
 * @param id The string to validate
 * @returns boolean indicating if the string is a valid UUID v4
 */
export function isValidId(id: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id);
} 