import { ensurePageAuth } from "@/lib/auth/server";
import { db } from "@database/database";
import { getOrganizationsForUserOrCreateDefault } from "@api/db/queries/organization";
import { notFound, redirect } from "next/navigation";

export default async function Auth() {
  const { user } = await ensurePageAuth();

  // If the user lands on this page and is not a member of any organization, we create a default one for them
  const orgs = await getOrganizationsForUserOrCreateDefault(db, {
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  });

  const orgToRedirectTo = orgs?.[0]?.organization;

  // This should never happen, but just in case
  if (!orgToRedirectTo || !orgToRedirectTo.slug) {
    console.error(`ERROR: User ${user?.id} has no organizations found`);

    notFound();
  }

  // Redirect to the active organization
  redirect(`/${orgToRedirectTo.slug}`);
}
