import { customAlphabet } from "nanoid";
import { ulid as ulidGenerator } from "ulid";

export const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export function isValidULID(ulid: string): boolean {
	return ULID_REGEX.test(ulid);
}

const NANOID_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const NANOID_LENGTH = 16;

export const generateConversationId = (): string => {
	const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);
	return `CO${nanoid()}`; // e.g. "CO4GKT9QZ2BJKXMVR"
};

export const generateMessageId = (): string => {
	return ulidGenerator(); // e.g. "01J3400000000000000000000"
};
