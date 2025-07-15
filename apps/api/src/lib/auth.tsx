import { db } from "@api/db";
import * as schema from "@api/db/schema";
import { waitingListEntry } from "@api/db/schema/waiting-list";
import { env } from "@api/env";
import { addUserToDefaultAudience, sendEmail } from "@api/lib/resend";
import { generateULID } from "@api/utils/db/ids";
import { generateUniqueReferralCode } from "@api/utils/referral-code";
import { triggerWorkflow } from "@api/utils/workflow";
import { WORKFLOW } from "@api/workflows/types";
import { JoinedWaitlistEmail } from "@cossistant/transactional/emails/joined-waitlist";
import { ResetPasswordEmail } from "@cossistant/transactional/emails/reset-password";
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
		autoSignIn: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			try {
				await sendEmail({
					to: [user.email],
					subject: "Reset your password",
					content: (
						<ResetPasswordEmail
							email={user.email}
							name={user.name}
							resetUrl={url}
						/>
					),
					includeUnsubscribe: false,
				});
				console.log(`Password reset email sent to ${user.email}`);
			} catch (error) {
				console.error("Failed to send password reset email:", error);
				throw new Error("Failed to send password reset email");
			}
		},
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
		"http://localhost:3001",
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
			scopes: ["openid", "email", "profile"],
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			scopes: ["user:email", "read:user"],
		},
	},
	advanced: {
		useSecureCookies: env.NODE_ENV === "production",
		defaultCookieAttributes: {
			secure: env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: env.NODE_ENV === "production" ? "none" : "lax",
			path: "/",
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
						// Generate unique referral code
						const referralCode = await generateUniqueReferralCode({
							name: createdUser.name || "",
							email: createdUser.email,
							image: createdUser.image || undefined,
						});

						// Add user to waiting list
						await db.insert(waitingListEntry).values({
							userId: createdUser.id,
							uniqueReferralCode: referralCode,
						});

						await triggerWorkflow({
							path: WORKFLOW.WAITLIST_JOIN,
							data: {
								userId: createdUser.id,
								email: createdUser.email,
								name: createdUser.name || "",
							},
						});
					} catch (error) {
						console.error("Error in user creation hook:", error);
						// Don't throw error to avoid blocking user creation
					}
				},
			},
		},
	},
}) satisfies ReturnType<typeof betterAuth>;

export type AuthType = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
};

export type OrigamiUser = typeof auth.$Infer.Session.user;
export type OrigamiSession = typeof auth.$Infer.Session.session;
