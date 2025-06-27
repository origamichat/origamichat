import { createHash, randomBytes } from "node:crypto";

const KEY_PREFIXES = {
	private: "sk_",
	public: "pk_",
} as const;

const KEY_LENGTHS = {
	private: 32, // 256 bits
	public: 24, // 192 bits
} as const;

export type KeyType = keyof typeof KEY_PREFIXES;

export function generateApiKey(keyType: KeyType) {
	const prefix = KEY_PREFIXES[keyType];
	const keyLength = KEY_LENGTHS[keyType];

	// Generate random bytes and convert to base64url (URL-safe)
	const randomBuffer = randomBytes(keyLength);
	const keyValue = randomBuffer
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, ""); // Remove padding

	const fullKey = `${prefix}${keyValue}`;

	return {
		fullKey,
		prefix,
		keyValue: fullKey,
	};
}

export function validateKeyFormat(key: string): {
	isValid: boolean;
	keyType?: KeyType;
	error?: string;
} {
	if (!key || typeof key !== "string") {
		return { isValid: false, error: "Key must be a non-empty string" };
	}

	// Check if key starts with a valid prefix
	const keyType = Object.entries(KEY_PREFIXES).find(([_, prefix]) =>
		key.startsWith(prefix)
	)?.[0] as KeyType;

	if (!keyType) {
		return {
			isValid: false,
			error: "Key must start with a valid prefix (sk_ or pk_)",
		};
	}

	const prefix = KEY_PREFIXES[keyType];
	const expectedMinLength = prefix.length + KEY_LENGTHS[keyType] - 2; // Account for base64 encoding variations
	const expectedMaxLength = prefix.length + KEY_LENGTHS[keyType] + 2;

	if (key.length < expectedMinLength || key.length > expectedMaxLength) {
		return {
			isValid: false,
			error: `Invalid key length for ${keyType} key`,
		};
	}

	// Validate base64url characters after prefix
	const keyBody = key.slice(prefix.length);
	const base64urlPattern = /^[A-Za-z0-9_-]+$/;

	if (!base64urlPattern.test(keyBody)) {
		return {
			isValid: false,
			error: "Key contains invalid characters",
		};
	}

	return { isValid: true, keyType };
}

export function hashApiKey(key: string): string {
	return createHash("sha256").update(key).digest("hex");
}

export function getKeyType(key: string): KeyType | null {
	const validation = validateKeyFormat(key);
	return validation.isValid ? validation.keyType! : null;
}

export function isPrivateKey(key: string): boolean {
	return getKeyType(key) === "private";
}

export function isPublicKey(key: string): boolean {
	return getKeyType(key) === "public";
}
