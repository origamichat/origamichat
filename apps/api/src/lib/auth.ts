import { db } from "@api/db";
import * as schema from "@api/db/schema";
import { waitingListEntry } from "@api/db/schema/waiting-list";
import { env } from "@api/env";
import { slugify } from "@api/utils/db";
import { generateULID } from "@api/utils/db/ids";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	admin,
	anonymous,
	organization as organizationPlugin,
} from "better-auth/plugins";

export const auth = betterAuth({
	baseURL:
		process.env.BETTER_AUTH_URL ||
		(process.env.NODE_ENV === "production"
			? "https://api.cossistant.com"
			: "http://localhost:8787"),
	secret: process.env.BETTER_AUTH_SECRET || undefined,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
		},
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true, // Auto sign-in after email registration
	},
	plugins: [
		organizationPlugin({
			organizationCreation: {
				disabled: false,
				afterCreate: async ({ organization, member, user }, request) => {
					console.log("organization created", organization);
					console.log("member", member);
					console.log("user", user);
				},
			},
		}),
		anonymous(),
		admin(),
	],
	// Allow requests from the frontend development server and production domains
	trustedOrigins: [
		"http://localhost:3000",
		"https://cossistant.com",
		"https://cossistant.com",
		"https://www.cossistant.com",
		"https://www.cossistant.com",
		"https://api.cossistant.com",
	],
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			scopes: ["identify", "email", "openid"],
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	advanced: {
		useSecureCookies: env.NODE_ENV === "production",
		defaultCookieAttributes: {
			secure: env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: "lax",
		},
		crossSubDomainCookies: {
			enabled: true,
			domain: env.NODE_ENV === "production" ? ".cossistant.com" : undefined,
		},
		// Add cookie prefix for better organization
		cookiePrefix: "cossistant-auth",
		// Generate ULID for the database
		database: {
			generateId() {
				return generateULID();
			},
		},
	},
	session: {
		// Cache the session in the cookie for 5 minutes
		// This is to avoid hitting the database for each request
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (createdUser) => {
					try {
						// Add user to waiting list
						await db.insert(waitingListEntry).values({
							userId: createdUser.id,
							uniqueReferralCode: slugify(createdUser.name),
						});

						// Add user to Resend audience - will be handled by external service
						// Note: In production, this should call the API service directly
						// For now, we'll just log the action
					} catch (error) {
						console.error("Error in user creation hook:", error);
						// Don't throw error to avoid blocking user creation
					}
				},
			},
		},
	},
});

export type AuthType = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
};

export type OrigamiUser = typeof auth.$Infer.Session.user;
export type OrigamiSession = typeof auth.$Infer.Session.session;
