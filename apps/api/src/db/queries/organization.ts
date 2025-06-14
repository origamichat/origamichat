import { eq, and, desc } from "drizzle-orm";
import {
  organization,
  member,
  invitation,
  type OrganizationSelect,
  type OrganizationInsert,
  type Database,
  auth,
} from "@repo/database";
import { generateSlugFromEmailDomain } from "@api/utils/organisation";

// Create organization
export async function createOrganization(
  db: Database,
  params: {
    data: OrganizationInsert;
  }
) {
  const [newOrganization] = await db
    .insert(organization)
    .values(params.data)
    .returning();

  return newOrganization;
}

// Get organization by ID
export async function getOrganizationById(
  db: Database,
  params: {
    orgId: string;
  }
) {
  const [org] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, params.orgId))
    .limit(1);

  return org;
}

// Get organization by slug
export async function getOrganizationBySlug(
  db: Database,
  params: {
    slug: string;
  }
) {
  const [org] = await db
    .select()
    .from(organization)
    .where(eq(organization.slug, params.slug))
    .limit(1);

  return org;
}

// Update organization
export async function updateOrganization(
  db: Database,
  params: {
    orgId: string;
    data: Partial<OrganizationInsert>;
  }
) {
  const [updatedOrg] = await db
    .update(organization)
    .set({
      ...params.data,
    })
    .where(eq(organization.id, params.orgId))
    .returning();

  return updatedOrg;
}

// Delete organization
export async function deleteOrganization(
  db: Database,
  params: {
    orgId: string;
  }
) {
  const [deletedOrg] = await db
    .delete(organization)
    .where(eq(organization.id, params.orgId))
    .returning();

  return deletedOrg;
}

// Get organizations for user
export async function getOrganizationsForUser(
  db: Database,
  params: {
    userId: string;
  }
) {
  const organizations = await db
    .select({
      organization,
      role: member.role,
      joinedAt: member.createdAt,
    })
    .from(organization)
    .innerJoin(member, eq(member.organizationId, organization.id))
    .where(eq(member.userId, params.userId))
    .orderBy(desc(member.createdAt))
    .$withCache();

  return organizations;
}

export async function getOrganizationsForUserOrCreateDefault(
  db: Database,
  params: {
    userId: string;
    userEmail: string;
    userName: string;
  }
) {
  const organizations = await getOrganizationsForUser(db, {
    userId: params.userId,
  });

  // If the user has no organizations, create a default one
  if (organizations.length === 0) {
    const { slug, organizationName } = await generateSlugFromEmailDomain(db, {
      email: params.userEmail,
    });

    const newOrganization = await auth.api.createOrganization({
      body: {
        name: organizationName,
        slug,
        userId: params.userId,
      },
    });

    return [
      {
        organization: newOrganization,
        role: "owner",
        joinedAt: new Date(),
      },
    ];
  }

  return organizations;
}

// Get organization members
export async function getOrganizationMembers(
  db: Database,
  params: {
    orgId: string;
    limit?: number;
    offset?: number;
  }
) {
  const members = await db
    .select()
    .from(member)
    .where(eq(member.organizationId, params.orgId))
    .orderBy(desc(member.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return members;
}

// Get organization invitations
export async function getOrganizationInvitations(
  db: Database,
  params: {
    orgId: string;
    status?: string;
  }
) {
  const invitations = await db
    .select()
    .from(invitation)
    .where(
      params.status
        ? and(
            eq(invitation.organizationId, params.orgId),
            eq(invitation.status, params.status)
          )
        : eq(invitation.organizationId, params.orgId)
    )
    .orderBy(desc(invitation.expiresAt));

  return invitations;
}

// Check if user is member of organization
export async function isUserMemberOfOrganization(
  db: Database,
  params: {
    userId: string;
    orgId: string;
  }
) {
  const [membership] = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.userId, params.userId),
        eq(member.organizationId, params.orgId)
      )
    )
    .limit(1);

  return !!membership;
}

// Get user role in organization
export async function getUserRoleInOrganization(
  db: Database,
  params: {
    userId: string;
    orgId: string;
  }
) {
  const [membership] = await db
    .select({ role: member.role })
    .from(member)
    .where(
      and(
        eq(member.userId, params.userId),
        eq(member.organizationId, params.orgId)
      )
    )
    .limit(1);

  return membership?.role;
}
