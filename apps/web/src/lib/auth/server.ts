import { db } from "@api/db";
import { getWaitlistEntryByUserId } from "@api/db/queries/waitlist";
import { auth, type OrigamiSession, type OrigamiUser } from "@api/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuth(): Promise<{
	user: OrigamiUser | null;
	session: OrigamiSession | null;
}> {
	try {
		const headersList = await headers();
		const session = await auth.api.getSession({
			headers: headersList,
		});

		return session ?? { user: null, session: null };
	} catch (error) {
		console.error(error);
		return { user: null, session: null };
	}
}

type EnsurePageAuthProps = {
	redirectTo: string;
};

export const ensurePageAuth = async (
	props: EnsurePageAuthProps = { redirectTo: "/" }
) => {
	const { session, user } = await getAuth();

	if (!(user && session)) {
		redirect(props.redirectTo);
	}

	return { session, user };
};

export const checkWaitlistAccess = async (userId: string) => {
	const waitlistData = await getWaitlistEntryByUserId(db, { userId });
	return waitlistData.entry?.accessGranted ?? false;
};

export const ensureWaitlistAccess = async (userId: string) => {
	const hasAccess = await checkWaitlistAccess(userId);

	if (!hasAccess) {
		redirect("/waitlist/joined");
	}

	return hasAccess;
};
