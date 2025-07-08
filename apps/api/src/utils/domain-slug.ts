import { nanoid } from "nanoid";

/**
 * Converts a domain name to a slug according to these rules:
 * - If domain ends with .com, remove .com (e.g., example.com → example)
 * - For any other single-level TLD, replace the dot with "dot" (e.g., example.io → exampledotio)
 * - For domains with multiple dots (subdomains or complex TLDs), extract apex name and add nanoid for uniqueness
 */
export function domainToSlug(domain: string): string {
	const dotCount = (domain.match(/\./g) || []).length;

	// Handle domains with multiple dots (subdomains or complex TLDs)
	if (dotCount > 1) {
		const parts = domain.split(".");
		// Extract the main domain name (second-to-last part for most cases)
		// For app.example.com -> "example"
		// For uk.gouv.fr -> "gouv"
		// For subdomain.uk.gouv -> "uk"
		const apexName = parts.at(-2) || parts.at(0) || "domain";
		return `${apexName}-${nanoid(6)}`;
	}

	// Handle simple domains with single dot
	if (domain.endsWith(".com")) {
		return domain.slice(0, -4); // Remove '.com'
	}

	// Replace dot with "dot" for other single-level TLDs
	return domain.replace(".", "dot");
}
