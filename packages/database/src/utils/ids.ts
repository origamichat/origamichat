import { ulid as ulidGenerator } from "ulid";
import { customAlphabet } from "nanoid";
import { customType } from "drizzle-orm/pg-core";

const NANOID_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const NANOID_LENGTH = 12;

/**
 * Generates a time-ordered ULID for use as primary keys in Postgres.
 * This is the most efficient ULID format for Postgres as it provides:
 * - Better index locality
 * - Reduced index fragmentation
 * - Better cache utilization
 * - Faster range queries
 * - Shorter length
 */

export const ulid = customType<{
  data: string;
  notNull: false;
  default: false;
}>({
  dataType() {
    return "ulid";
  },
});

export const generateULID = (): string => {
  return ulidGenerator();
};

export const generateShortPrimaryId = (): string => {
  const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);

  return nanoid(); // => "DWZPD8BERQKP"
};
