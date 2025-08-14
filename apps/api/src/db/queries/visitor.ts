import type { Database } from "@api/db";
import { visitor } from "@api/db/schema";
import { generateULID } from "@api/utils/db/ids";
import { eq, or } from "drizzle-orm";

export async function upsertVisitor(
  db: Database,
  params: {
    websiteId: string;
    organizationId: string;
    visitorId?: string | null;
  }
) {
  const visitorId = params.visitorId ?? generateULID();

  const [newVisitor] = await db
    .insert(visitor)
    .values({
      id: visitorId,
      websiteId: params.websiteId,
      organizationId: params.organizationId,
      lastConnectedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: visitor.id,
      set: {
        lastConnectedAt: new Date(),
      },
    })
    .returning();

  return newVisitor;
}

export async function getVisitor(
  db: Database,
  params: {
    visitorId?: string | null;
    externalVisitorId?: string | null;
  }
) {
  if (!(params.visitorId || params.externalVisitorId)) {
    return;
  }

  const query = params.visitorId
    ? eq(visitor.id, params.visitorId)
    : params.externalVisitorId
      ? eq(visitor.externalId, params.externalVisitorId)
      : null;

  // Safety net, means we didn't
  if (!query) {
    return;
  }

  const _visitor = await db.query.visitor
    .findFirst({
      where: query,
    })
    .execute();

  return _visitor;
}
