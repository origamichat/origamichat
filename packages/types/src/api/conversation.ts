import { z } from "@hono/zod-openapi";
import { ConversationSchema } from "../schemas";
import { paginationResponseSchema, paginationSchema } from "./common";

export const listConversationsQuerySchema = paginationSchema.openapi({
	description: "List conversations for the current visitor",
});

export const listConversationsResponseSchema = z
	.object({
		conversations: z.array(ConversationSchema),
		pagination: paginationResponseSchema,
	})
	.openapi({ description: "Paginated list of conversations" });

export type ListConversationsResponse = z.infer<
	typeof listConversationsResponseSchema
>;
