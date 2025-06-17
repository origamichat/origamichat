import { ensurePageAuth } from "@/lib/auth/server";
import { db } from "@database/database";
import { getOrganizationsForUserOrCreateDefault } from "@api/db/queries/organization";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SELECTED_WEBSITE_COOKIE_NAME } from "@/constants";
import { OrganizationSelect, WebsiteSelect } from "@database/schema";

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
  websiteId: string | undefined;
  organizationSlug: string | undefined;
} => {
  // Should not happen, but just in case
  if (orgs.length === 0) {
    return {
      websiteId: undefined,
      organizationSlug: undefined,
    };
  }

  // If the user has no selected website, we redirect to the first website in the first organization
  if (!selectedWebsiteId) {
    return {
      websiteId: orgs[0]?.websites?.[0]?.id,
      organizationSlug: orgs[0]?.organization.slug ?? undefined,
    };
  }

  const website = orgs.find((org) =>
    org.websites.some((website) => website.id === selectedWebsiteId)
  );

  return {
    websiteId: website?.websites[0]?.id,
    organizationSlug: website?.organization.slug ?? undefined,
  };
};

export default async function Auth() {
  const { user } = await ensurePageAuth();
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

  const { websiteId, organizationSlug } = getDefaultWebsiteToRedirectTo({
    selectedWebsiteId,
    orgs,
  });

  // This should never happen, but just in case
  if (!organizationSlug) {
    console.error(`ERROR: User ${user?.id} has no organizations found`);

    notFound();
  }

  // If the user has no website, we redirect to the onboarding "welcome"
  if (!websiteId) {
    redirect(`/welcome/${organizationSlug}`);
  }

  // Redirect to the active organization
  redirect(`/${websiteId}`);
}
