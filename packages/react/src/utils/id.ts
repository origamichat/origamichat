import { customAlphabet } from "nanoid";

const NANOID_ALPHABET = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const NANOID_LENGTH = 16;

// Special conversation ID to indicate that no conversation exists yet
// Used when navigating to conversation page before actually creating the conversation
export const PENDING_CONVERSATION_ID = "__pending__" as const;

export const generateShortPrimaryId = (): string => {
	const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);
	return `CO${nanoid()}`; // e.g. "CO4GKT9QZ2BJKXMVR"
};
