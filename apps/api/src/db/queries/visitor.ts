import { eq, and, desc, isNull, like, or, count, gte } from "drizzle-orm";
import { visitor, type Database, type VisitorInsert } from "@cossistant/database";

// Create visitor
export async function createVisitor(
  db: Database,
  params: {
    orgId: string;
    data: Omit<VisitorInsert, "organizationId">;
  }
) {
  const [newVisitor] = await db
    .insert(visitor)
    .values({
      ...params.data,
      organizationId: params.orgId,
    })
    .returning();

  return newVisitor;
}

// Get visitor by ID (with org check)
export async function getVisitorById(
  db: Database,
  params: {
    orgId: string;
    visitorId: string;
  }
) {
  const [visitorData] = await db
    .select()
    .from(visitor)
    .where(
      and(
        eq(visitor.id, params.visitorId),
        eq(visitor.organizationId, params.orgId),
        isNull(visitor.deletedAt)
      )
    )
    .limit(1);

  return visitorData;
}

// Get visitor by identifier and website
export async function getVisitorByIdentifier(
  db: Database,
  params: {
    orgId: string;
    identifier: string;
    websiteId: string;
  }
) {
  const [visitorData] = await db
    .select()
    .from(visitor)
    .where(
      and(
        eq(visitor.identifier, params.identifier),
        eq(visitor.websiteId, params.websiteId),
        eq(visitor.organizationId, params.orgId),
        isNull(visitor.deletedAt)
      )
    )
    .limit(1);

  return visitorData;
}

// Get all visitors for organization
export async function getVisitorsByOrganization(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const visitors = await db
    .select()
    .from(visitor)
    .where(
      and(
        eq(visitor.organizationId, params.orgId),
        params.websiteId ? eq(visitor.websiteId, params.websiteId) : undefined,
        isNull(visitor.deletedAt)
      )
    )
    .orderBy(desc(visitor.lastConnectedAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return visitors;
}

// Get active visitors (connected recently)
export async function getActiveVisitors(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
    minutesThreshold?: number;
  }
) {
  const threshold = new Date(
    Date.now() - (params.minutesThreshold ?? 30) * 60 * 1000
  );

  const visitors = await db
    .select()
    .from(visitor)
    .where(
      and(
        eq(visitor.organizationId, params.orgId),
        params.websiteId ? eq(visitor.websiteId, params.websiteId) : undefined,
        gte(visitor.lastConnectedAt, threshold),
        isNull(visitor.deletedAt)
      )
    )
    .orderBy(desc(visitor.lastConnectedAt));

  return visitors;
}

// Search visitors by name or email
export async function searchVisitors(
  db: Database,
  params: {
    orgId: string;
    query: string;
    websiteId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const visitors = await db
    .select()
    .from(visitor)
    .where(
      and(
        eq(visitor.organizationId, params.orgId),
        params.websiteId ? eq(visitor.websiteId, params.websiteId) : undefined,
        or(
          like(visitor.name, `%${params.query}%`),
          like(visitor.email, `%${params.query}%`),
          like(visitor.identifier, `%${params.query}%`)
        ),
        isNull(visitor.deletedAt)
      )
    )
    .orderBy(desc(visitor.lastConnectedAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  return visitors;
}

// Update visitor
export async function updateVisitor(
  db: Database,
  params: {
    orgId: string;
    visitorId: string;
    data: Partial<Omit<VisitorInsert, "organizationId">>;
  }
) {
  const [updatedVisitor] = await db
    .update(visitor)
    .set({
      ...params.data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(visitor.id, params.visitorId),
        eq(visitor.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedVisitor;
}

// Update visitor last connected time
export async function updateVisitorLastConnected(
  db: Database,
  params: {
    orgId: string;
    visitorId: string;
  }
) {
  const [updatedVisitor] = await db
    .update(visitor)
    .set({
      lastConnectedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(visitor.id, params.visitorId),
        eq(visitor.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedVisitor;
}

// Soft delete visitor
export async function deleteVisitor(
  db: Database,
  params: {
    orgId: string;
    visitorId: string;
  }
) {
  const [deletedVisitor] = await db
    .update(visitor)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(visitor.id, params.visitorId),
        eq(visitor.organizationId, params.orgId)
      )
    )
    .returning();

  return deletedVisitor;
}

// Restore visitor
export async function restoreVisitor(
  db: Database,
  params: {
    orgId: string;
    visitorId: string;
  }
) {
  const [restoredVisitor] = await db
    .update(visitor)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(visitor.id, params.visitorId),
        eq(visitor.organizationId, params.orgId)
      )
    )
    .returning();

  return restoredVisitor;
}

// Get visitor statistics
export async function getVisitorStats(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
  }
) {
  const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes

  const stats = await db
    .select({
      total: count(),
      active: count(gte(visitor.lastConnectedAt, threshold)),
    })
    .from(visitor)
    .where(
      and(
        eq(visitor.organizationId, params.orgId),
        params.websiteId ? eq(visitor.websiteId, params.websiteId) : undefined,
        isNull(visitor.deletedAt)
      )
    );

  return stats[0];
}
