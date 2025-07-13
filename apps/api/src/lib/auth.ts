import { db } from "@api/db";
import * as schema from "@api/db/schema";
import { waitingListEntry } from "@api/db/schema/waiting-list";
import { env } from "@api/env";
import resend from "@api/lib/resend";
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
		sendResetPassword: async ({ user, url, token }, request) => {
			try {
				await resend.emails.send({
					from: "Cossistant <noreply@cossistant.com>",
					to: user.email,
					subject: "Reset your password",
					html: `
						<!DOCTYPE html>
						<html>
						<head>
							<meta charset="utf-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>Reset your password</title>
						</head>
						<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
							<div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
								<h1 style="color: #000; font-size: 24px; margin: 0 0 20px 0;">Reset your password</h1>
								<p style="margin: 0 0 20px 0;">Hi ${user.name || "there"},</p>
								<p style="margin: 0 0 20px 0;">We received a request to reset your password. Click the button below to create a new password:</p>
								<a href="${url}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">Reset Password</a>
								<p style="margin: 20px 0 0 0; font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email. The link will expire in 1 hour.</p>
							</div>
							<p style="font-size: 12px; color: #999; text-align: center;">© 2024 Cossistant. All rights reserved.</p>
						</body>
						</html>
					`,
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
}) satisfies ReturnType<typeof betterAuth>;

export type AuthType = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
};

export type OrigamiUser = typeof auth.$Infer.Session.user;
export type OrigamiSession = typeof auth.$Infer.Session.session;
