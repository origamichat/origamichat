import { db } from "@api/db";
import { waitingListEntry } from "@api/db/schema/waiting-list";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { slugify } from "./db";

interface UserInfo {
	name: string;
	email: string;
	image?: string;
}

/**
 * Generates a unique referral code for a user, trying multiple strategies
 * to create a clean, readable code while ensuring uniqueness.
 */
export async function generateUniqueReferralCode(
	userInfo: UserInfo
): Promise<string> {
	const baseCode = createBaseReferralCode(userInfo);

	// Try the base code first
	if (await isReferralCodeAvailable(baseCode)) {
		return baseCode;
	}

	// Try with short nanoid suffix (3 chars for readability)
	const maxRetries = 5;
	for (let i = 0; i < maxRetries; i++) {
		const codeWithSuffix = `${baseCode}-${nanoid(3)}`;
		// biome-ignore lint/nursery/noAwaitInLoop: No risk here
		if (await isReferralCodeAvailable(codeWithSuffix)) {
			return codeWithSuffix;
		}
	}

	// Fallback: use email prefix with nanoid
	const emailPrefix = userInfo.email.split("@")[0];
	const fallbackCode = `${slugify(emailPrefix)}-${nanoid(6)}`;

	// This should virtually always work, but check anyway
	if (await isReferralCodeAvailable(fallbackCode)) {
		return fallbackCode;
	}

	// Ultimate fallback: pure nanoid (should never reach here)
	return `user-${nanoid(8)}`;
}

/**
 * Creates the base referral code using the best available information
 * Priority: name > username from email > email prefix
 */
function createBaseReferralCode(userInfo: UserInfo): string {
	// Try to use the full name if available
	if (userInfo.name?.trim()) {
		return slugify(userInfo.name.trim());
	}

	// Fallback to email prefix
	const emailPrefix = userInfo.email.split("@")[0];
	return slugify(emailPrefix);
}

/**
 * Checks if a referral code is available in the database
 */
async function isReferralCodeAvailable(code: string): Promise<boolean> {
	try {
		const existing = await db
			.select({ id: waitingListEntry.id })
			.from(waitingListEntry)
			.where(eq(waitingListEntry.uniqueReferralCode, code))
			.limit(1);

		return existing.length === 0;
	} catch (error) {
		console.error("Error checking referral code availability:", error);
		// If we can't check, assume it's not available to be safe
		return false;
	}
}
