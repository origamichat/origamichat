import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
		? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`
		: "http://localhost:8787/api/auth",
	fetchOptions: {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	},
	plugins: [organizationClient(), adminClient()],
});

export const {
	useSession,
	signIn,
	signUp,
	signOut,
	forgetPassword,
	resetPassword,
} = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
