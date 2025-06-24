import { eq, and, desc, isNull, like, or, count, sql } from "drizzle-orm";
import { aiAgent, type Database, type AiAgentInsert } from "@cossistant/database";

// Create AI agent
export async function createAiAgent(
  db: Database,
  params: {
    orgId: string;
    data: Omit<AiAgentInsert, "organizationId">;
  }
) {
  const [newAiAgent] = await db
    .insert(aiAgent)
    .values({
      ...params.data,
      organizationId: params.orgId,
    })
    .returning();

  return newAiAgent;
}

// Get AI agent by ID (with org check)
export async function getAiAgentById(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
  }
) {
  const [agent] = await db
    .select()
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.id, params.aiAgentId),
        eq(aiAgent.organizationId, params.orgId),
        isNull(aiAgent.deletedAt)
      )
    )
    .limit(1);

  return agent;
}

// Get AI agents for organization
export async function getAiAgentsByOrganization(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  const agents = await db
    .select()
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.organizationId, params.orgId),
        params.websiteId ? eq(aiAgent.websiteId, params.websiteId) : undefined,
        params.isActive !== undefined
          ? eq(aiAgent.isActive, params.isActive)
          : undefined,
        isNull(aiAgent.deletedAt)
      )
    )
    .orderBy(desc(aiAgent.lastUsedAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return agents;
}

// Get active AI agents for website
export async function getActiveAiAgentsForWebsite(
  db: Database,
  params: {
    orgId: string;
    websiteId: string;
  }
) {
  const agents = await db
    .select()
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.organizationId, params.orgId),
        eq(aiAgent.websiteId, params.websiteId),
        eq(aiAgent.isActive, true),
        isNull(aiAgent.deletedAt)
      )
    )
    .orderBy(desc(aiAgent.lastUsedAt));

  return agents;
}

// Search AI agents by name or description
export async function searchAiAgents(
  db: Database,
  params: {
    orgId: string;
    query: string;
    websiteId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const agents = await db
    .select()
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.organizationId, params.orgId),
        or(
          like(aiAgent.name, `%${params.query}%`),
          like(aiAgent.description, `%${params.query}%`)
        ),
        params.websiteId ? eq(aiAgent.websiteId, params.websiteId) : undefined,
        isNull(aiAgent.deletedAt)
      )
    )
    .orderBy(desc(aiAgent.lastUsedAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  return agents;
}

// Get AI agents by model
export async function getAiAgentsByModel(
  db: Database,
  params: {
    orgId: string;
    model: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }
) {
  const agents = await db
    .select()
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.organizationId, params.orgId),
        eq(aiAgent.model, params.model),
        params.isActive !== undefined
          ? eq(aiAgent.isActive, params.isActive)
          : undefined,
        isNull(aiAgent.deletedAt)
      )
    )
    .orderBy(desc(aiAgent.usageCount))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return agents;
}

// Update AI agent
export async function updateAiAgent(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
    data: Partial<Omit<AiAgentInsert, "organizationId">>;
  }
) {
  const [updatedAgent] = await db
    .update(aiAgent)
    .set({
      ...params.data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(aiAgent.id, params.aiAgentId),
        eq(aiAgent.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedAgent;
}

// Update AI agent usage
export async function updateAiAgentUsage(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
  }
) {
  const [updatedAgent] = await db
    .update(aiAgent)
    .set({
      lastUsedAt: new Date(),
      usageCount: sql`${aiAgent.usageCount} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(aiAgent.id, params.aiAgentId),
        eq(aiAgent.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedAgent;
}

// Activate/Deactivate AI agent
export async function toggleAiAgentStatus(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
    isActive: boolean;
  }
) {
  const [updatedAgent] = await db
    .update(aiAgent)
    .set({
      isActive: params.isActive,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(aiAgent.id, params.aiAgentId),
        eq(aiAgent.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedAgent;
}

// Soft delete AI agent
export async function deleteAiAgent(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
  }
) {
  const [deletedAgent] = await db
    .update(aiAgent)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(aiAgent.id, params.aiAgentId),
        eq(aiAgent.organizationId, params.orgId)
      )
    )
    .returning();

  return deletedAgent;
}

// Restore AI agent
export async function restoreAiAgent(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
  }
) {
  const [restoredAgent] = await db
    .update(aiAgent)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(aiAgent.id, params.aiAgentId),
        eq(aiAgent.organizationId, params.orgId)
      )
    )
    .returning();

  return restoredAgent;
}

// Get AI agent statistics
export async function getAiAgentStats(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
  }
) {
  const stats = await db
    .select({
      total: count(),
      active: count(eq(aiAgent.isActive, true)),
      inactive: count(eq(aiAgent.isActive, false)),
    })
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.organizationId, params.orgId),
        params.websiteId ? eq(aiAgent.websiteId, params.websiteId) : undefined,
        isNull(aiAgent.deletedAt)
      )
    );

  return stats[0];
}

// Get most used AI agents
export async function getMostUsedAiAgents(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
    limit?: number;
  }
) {
  const agents = await db
    .select()
    .from(aiAgent)
    .where(
      and(
        eq(aiAgent.organizationId, params.orgId),
        params.websiteId ? eq(aiAgent.websiteId, params.websiteId) : undefined,
        eq(aiAgent.isActive, true),
        isNull(aiAgent.deletedAt)
      )
    )
    .orderBy(desc(aiAgent.usageCount))
    .limit(params.limit ?? 10);

  return agents;
}
