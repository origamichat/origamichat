import { db } from "@api/db";
import { getOrganizationsForUserOrCreateDefault } from "@api/db/queries/organization";
import type { OrganizationSelect, WebsiteSelect } from "@api/db/schema";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SELECTED_WEBSITE_COOKIE_NAME } from "@/constants";
import { ensurePageAuth, ensureWaitlistAccess } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const getDefaultWebsiteToRedirectTo = ({
	selectedWebsiteId,
	orgs,
}: {
	selectedWebsiteId: string | undefined;
	orgs: {
		organization: OrganizationSelect;
		websites: WebsiteSelect[];
		role: string;
		joinedAt: Date;
	}[];
}): {
	websiteSlug: string | undefined;
	organizationSlug: string | undefined;
} => {
	// Should not happen, but just in case
	if (orgs.length === 0) {
		return {
			websiteSlug: undefined,
			organizationSlug: undefined,
		};
	}

	// If the user has no selected website, we redirect to the first website in the first organization
	if (!selectedWebsiteId) {
		return {
			websiteSlug: orgs[0]?.websites?.[0]?.slug,
			organizationSlug: orgs[0]?.organization.slug ?? undefined,
		};
	}

	const website = orgs.find((org) =>
		org.websites.some((w) => w.id === selectedWebsiteId)
	);

	return {
		websiteSlug: website?.websites[0]?.slug,
		organizationSlug: website?.organization.slug ?? undefined,
	};
};

export default async function Select() {
	const { user } = await ensurePageAuth();

	// Check if user has valid waiting list access
	await ensureWaitlistAccess(user.id);

	const cookieStore = await cookies();

	// If the user has a selected website already
	const selectedWebsiteId = cookieStore.get(
		SELECTED_WEBSITE_COOKIE_NAME
	)?.value;

	// If the user lands on this page and is not a member of any organization, we create a default one for them
	const orgs = await getOrganizationsForUserOrCreateDefault(db, {
		userId: user?.id,
		userEmail: user?.email,
		userName: user?.name,
	});

	const { websiteSlug, organizationSlug } = getDefaultWebsiteToRedirectTo({
		selectedWebsiteId,
		orgs,
	});

	// This should never happen, but just in case
	if (!organizationSlug) {
		console.error(`ERROR: User ${user?.id} has no organizations found`);

		notFound();
	}

	// If the user has no website, we redirect to the onboarding "welcome"
	if (!websiteSlug) {
		redirect(`/welcome/${organizationSlug}`);
	}

	// Redirect to the active organization
	redirect(`/${websiteSlug}`);
}
