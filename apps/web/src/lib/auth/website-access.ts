import { db } from "@api/db";
import { checkUserWebsiteAccess } from "@api/db/queries/website";
import { notFound, redirect } from "next/navigation";
import { getAuth } from "./server";

export async function ensureWebsiteAccess(websiteSlug: string) {
	const { user } = await getAuth();

	if (!user) {
		redirect("/");
	}

	const accessCheck = await checkUserWebsiteAccess(db, {
		userId: user.id,
		websiteSlug,
	});

	if (!accessCheck.hasAccess) {
		notFound();
	}

	return {
		user,
		website: accessCheck.website,
	};
}
