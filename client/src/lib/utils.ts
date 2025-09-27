import { format, formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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


/**
 * @param date string | Date
 * @param options { relative?: boolean }
 * @returns string
 */
export function formatDate(
  date: string | Date = "Unknown",
  options: { relative?: boolean } = {}
) {
  if (!date || date === "Unknown") return "Unknown";

  let parsed: Date;
  if (typeof date === "string") {
    parsed = toZonedTime(new Date(date), "UTC");
  } else {
    parsed = toZonedTime(date, "UTC");
  }

  if (options.relative) {
    return formatDistanceToNow(parsed, { addSuffix: true }); 
  }

  return format(parsed, "MMM d, yyyy"); 
}


