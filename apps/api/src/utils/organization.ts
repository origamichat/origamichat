import type { Database } from "@api/db";
import { organization } from "@api/db/schema";

import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

// list of forbidden words for organization names
const FORBIDDEN_SLUGS = [
	"cossistant",
	"admin",
	"api",
	"cossistant-chat",
	"cossistant",
	"org",
	"select",
	"website",
	"app",
	"web",
	"www",
	"blog",
	"docs",
	"help",
	"support",
	"contact",
	"welcome",
	"about",
	"terms",
	"privacy",
	"security",
	"login",
	"register",
	"dashboard",
	"settings",
	"profile",
	"account",
	"billing",
	"feature",
	"features",
	"page",
	"pages",
	"playground",
];

// Most popular email domains that B2B customers might use
// These are considered "popular" domains where we should generate random slugs
const POPULAR_EMAIL_DOMAINS = [
	// Consumer email providers
	"gmail.com",
	"yahoo.com",
	"hotmail.com",
	"outlook.com",
	"icloud.com",
	"me.com",
	"mac.com",
	"protonmail.com",
	"proton.me",
	"tutanota.com",
	"zoho.com",
	"yandex.com",
	"yandex.ru",
	"aol.com",
	"gmx.com",
	"gmx.net",
	"gmx.de",
	"t-online.de",
	"web.de",
	"mail.com",
	"mail.ru",
	"qq.com",
	"163.com",
	"126.com",
	"sina.com",
	"naver.com",
	"daum.net",
	"rediffmail.com",

	// Popular business email providers (where companies often use generic domains)
	"google.com", // Google Workspace but on google.com domain
	"microsoft.com",
	"office365.com",
	"live.com",
	"msn.com",
	"windowslive.com",

	// Other popular free providers
	"fastmail.com",
	"hey.com",
	"superhuman.com",
];

// URL-friendly alphabet for slug generation (lowercase letters and numbers)
const SLUG_ALPHABET = "ORIGAMIorigami0123456789";
const SLUG_LENGTH = 8;

// Create nanoId generator for slugs
const generateNanoSlugId = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH);

export function isForbiddenSlug(slug: string): boolean {
	return FORBIDDEN_SLUGS.includes(slug.toLowerCase());
}

export function isPopularEmailDomain(email: string): boolean {
	const domain = email.split("@")[1]?.toLowerCase();
	return domain ? POPULAR_EMAIL_DOMAINS.includes(domain) : false;
}

export function generateSlugFromName(name: string): string {
	// remove all non-alphanumeric characters and convert to lowercase
	let slug = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

	// if empty after cleaning, generate random slug
	if (!slug) {
		return generateNanoSlugId();
	}

	// if the slug is in the forbidden words list, add a random number to the end
	if (isForbiddenSlug(slug)) {
		slug = `${slug}-${Math.floor(Math.random() * 1_000_000)}`;
	}

	return slug;
}

export async function generateSlugFromEmailDomain(
	db: Database,
	params: {
		email: string;
	}
): Promise<{ slug: string; organizationName: string }> {
	const domain = params.email.split("@")[1]?.toLowerCase();

	if (!domain) {
		const slug = generateNanoSlugId();

		return { slug, organizationName: slug.replace(/-/g, " ") };
	}

	// If this is a popular email domain, generate a random slug instead
	if (isPopularEmailDomain(params.email)) {
		const slug = generateNanoSlugId();

		return { slug, organizationName: slug.replace(/-/g, " ") };
	}

	// Remove everything after the first dot and clean the domain
	let slug = domain
		.split(".")[0]
		.replace(/[^a-zA-Z0-9]/g, "")
		.toLowerCase();

	// if empty after cleaning, generate random slug
	if (!slug) {
		const generatedSlug = generateNanoSlugId();

		return {
			slug: generatedSlug,
			organizationName: generatedSlug.replace(/-/g, " "),
		};
	}

	// if the slug is in the forbidden words list, add a random number to the end
	if (isForbiddenSlug(slug)) {
		slug = `${slug}-${generateNanoSlugId()}`;
	}

	// check if the slug is already taken
	const existingOrganization = await db.query.organization.findFirst({
		where: eq(organization.slug, slug),
	});

	if (existingOrganization) {
		return {
			slug: generateNanoSlugId(),
			organizationName: existingOrganization.name,
		};
	}

	return { slug, organizationName: slug.replace(/-/g, " ") };
}
