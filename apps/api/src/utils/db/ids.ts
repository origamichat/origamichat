// utils/ids.ts

import { varchar } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";
import { ulid as ulidGenerator } from "ulid";

const NANOID_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const NANOID_LENGTH = 16;

export const generateShortPrimaryId = (): string => {
  const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);
  return `CO${nanoid()}`; // e.g. "CO4GKT9QZ2BJKXMVR"
};

export const generateULID = (): string => {
  return ulidGenerator(); // e.g. "01J3400000000000000000000"
};

/**
 * Reusable VARCHAR primary key column using ULID
 */
export const ulidPrimaryKey = (name: string) =>
  varchar(name, { length: 26 }).primaryKey().notNull().$defaultFn(generateULID);

/**
 * Reusable VARCHAR primary key column using short NanoID
 */
export const nanoidPrimaryKey = (name: string) =>
  varchar(name, { length: 18 })
    .primaryKey()
    .notNull()
    .$defaultFn(generateShortPrimaryId);

/**
 * Reusable VARCHAR reference column using ULID
 */
export const ulidReference = (name: string) =>
  varchar(name, { length: 26 }).notNull();

export const ulidNullableReference = (name: string) =>
  varchar(name, { length: 26 });

/**
 * Reusable VARCHAR reference column using short NanoID
 */
export const nanoidReference = (name: string) =>
  varchar(name, { length: 18 }).notNull();
