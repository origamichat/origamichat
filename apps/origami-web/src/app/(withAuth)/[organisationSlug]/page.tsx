import { ensurePageAuth } from "@/lib/auth/server";
import TestTRPC from "./TestTRPC";
import { db } from "@database/database";
import { getOrganizationsForUserOrCreateDefault } from "@api/db/queries/organization";

export default async function Auth() {
  const { user } = await ensurePageAuth();

  // If the user lands on this page and is not a member of any organization, we create a default one for them
  const orgs = await getOrganizationsForUserOrCreateDefault(db, {
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  });

  // Redirect to the active organization

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Origami</h1>
      <p>You're signed-in as {user?.email}</p>

      <TestTRPC />
    </div>
  );
}
