import { ulid } from "ulid";
import { customAlphabet } from "nanoid";

const NANOID_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const NANOID_LENGTH = 12;

/**
 * Generates a time-ordered ULID for use as primary keys in MySQL.
 * This is the most efficient ULID format for MySQL as it provides:
 * - Better index locality
 * - Reduced index fragmentation
 * - Better cache utilization
 * - Faster range queries
 * - Shorter length
 */
export const generatePrimaryId = (): string => {
  return ulid();
};

export const generateShortPrimaryId = (): string => {
  const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);

  return nanoid(); // => "DWZPD8BERQKP"
};
