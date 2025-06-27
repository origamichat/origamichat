import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const DOMAIN_REGEX =
	/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])+$/;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidDomain(domain: string) {
	// Reject URLs with protocols
	if (domain.includes("://")) {
		return false;
	}

	// Match valid domain names with at least one dot and proper TLD format
	// This will match patterns like: example.com, sub.example.com
	// But reject: example, http://example.com
	return DOMAIN_REGEX.test(domain);
}
