import { z } from "@hono/zod-openapi";

export const organizationResponseSchema = z.object({
	id: z.string().ulid().openapi({
		description: "The organization's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	name: z.string().openapi({
		description: "The organization's name.",
		example: "Acme Corp",
	}),
});
