import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const conversationRouter = createTRPCRouter({
	listByWebsite: protectedProcedure
		.input(
			z.object({
				websiteId: z.string().ulid(),
				limit: z.number().int().min(1).max(100).optional(),
				cursor: z.string().nullable().optional(),
			})
		)
		.output(
			z.object({
				items: z.array(
					z.object({
						id: z.string(),
						status: z.string(),
						priority: z.string(),
						assignedTeamMemberId: z.string().nullable(),
						organizationId: z.string(),
						visitorId: z.string(),
						websiteId: z.string(),
						title: z.string().nullable(),
						readBy: z.array(z.string()).nullable().optional(),
						lastReadAt: z.any().nullable(),
						lastMessageAt: z.date().nullable(),
						resolutionTime: z.number().nullable(),
						createdAt: z.date(),
						updatedAt: z.date(),
						deletedAt: z.date().nullable(),
						lastMessagePreview: z.string().nullable(),
					})
				),
				nextCursor: z.string().nullable(),
			})
		)
		.query(async ({ ctx, input }) => {
			return {
				items: [],
				nextCursor: null,
			};
		}),
});
