import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decode JWT token and extract user ID from Hasura claims
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['https://hasura.io/jwt/claims']?.['x-hasura-user-id'] || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
