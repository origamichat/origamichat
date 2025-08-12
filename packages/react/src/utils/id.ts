import { customAlphabet } from "nanoid";

const NANOID_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const NANOID_LENGTH = 16;

export const generateShortPrimaryId = (): string => {
	const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);
	return `CO${nanoid()}`; // e.g. "CO4GKT9QZ2BJKXMVR"
};
