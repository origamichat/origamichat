import { Database, organization, OrganizationSelect } from "@repo/database";
import { eq } from "drizzle-orm";

export async function getOrganizationById(
  db: Database,
  id: string
): Promise<OrganizationSelect> {
  const [result] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, id))
    .limit(1);

  return result;
}
