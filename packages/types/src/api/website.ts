import { z } from "@hono/zod-openapi";
import { APIKeyType, WebsiteInstallationTarget } from "../enums";

/**
 * Website creation request schema
 */
export const createWebsiteRequestSchema = z.object({
	name: z
		.string()
		.openapi({
			description: "The website's name.",
			example: "Dub",
		})
		.min(3, {
			message: "Name must be at least 3 characters",
		})
		.max(30, {
			message: "Name must be less than 30 characters",
		}),
	domain: z
		.string()
		.regex(/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/)
		.openapi({
			description: "The website's domain.",
			example: "dub.co",
		}),
	organizationId: z.string().ulid().openapi({
		description: "The organization's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	installationTarget: z.nativeEnum(WebsiteInstallationTarget).openapi({
		description: "The website's library installation target.",
		example: WebsiteInstallationTarget.NEXTJS,
	}),
});

export type CreateWebsiteRequest = z.infer<typeof createWebsiteRequestSchema>;

/**
 * Website creation response schema
 */
export const createWebsiteResponseSchema = z.object({
	id: z.string().ulid().openapi({
		description: "The website's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	name: z.string().openapi({
		description: "The website's name.",
		example: "Dub",
	}),
	whitelistedDomains: z.array(z.string().url()).openapi({
		description: "The website's whitelisted domains.",
		example: ["http://localhost:3000", "https://dub.co"],
	}),
	organizationId: z.string().ulid().openapi({
		description: "The organization's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	apiKeys: z
		.array(
			z.object({
				id: z.string().ulid().openapi({
					description: "The API key's unique identifier.",
					example: "01JG000000000000000000000",
				}),
				key: z.string().openapi({
					description: "The API key's value.",
					example: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
				}),
				createdAt: z.date().openapi({
					description: "The API key's creation date.",
					example: "2021-01-01T00:00:00.000Z",
				}),
				isTest: z.boolean().openapi({
					description: "Whether the API key is a test key.",
					example: false,
				}),
				isActive: z.boolean().openapi({
					description: "Whether the API key is active.",
					example: true,
				}),
				keyType: z.nativeEnum(APIKeyType).openapi({
					description: "The API key's type (public or private).",
					example: APIKeyType.PUBLIC,
				}),
			})
		)
		.openapi({
			description: "The website's API keys.",
			example: [
				{
					id: "01JG000000000000000000000",
					key: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
					createdAt: new Date("2021-01-01T00:00:00.000Z"),
					isTest: true,
					isActive: true,
					keyType: APIKeyType.PUBLIC,
				},
			],
		}),
});

export type CreateWebsiteResponse = z.infer<typeof createWebsiteResponseSchema>;

/**
 * Website domain validation request schema
 */
export const checkWebsiteDomainRequestSchema = z.object({
	domain: z
		.string()
		.regex(/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/)
		.openapi({
			description: "The website's domain.",
			example: "dub.co",
		}),
});

export type CheckWebsiteDomainRequest = z.infer<
	typeof checkWebsiteDomainRequestSchema
>;

export const availableHumanAgentSchema = z.object({
	id: z.string().ulid().openapi({
		description: "The human agent's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	name: z.string().openapi({
		description: "The agent's name.",
		example: "John Doe",
	}),
	image: z.string().nullable().openapi({
		description: "The agent's avatar URL.",
		example: "https://cossistant.com/avatar.png",
	}),
	lastOnlineAt: z.string().datetime().nullable().openapi({
		description:
			"The agent's last online timestamp, used to determine if the agent is online. If the agent is offline, this will be null or more than 5 minutes ago.",
		example: "2021-01-01T00:00:00.000Z",
	}),
});

export const AvailableAIAgentSchema = z.object({
	id: z.string().ulid().openapi({
		description: "The AI agent's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	name: z.string().openapi({
		description: "The AI agent's name.",
		example: "John Doe",
	}),
	image: z.string().nullable().openapi({
		description: "The AI agent's avatar URL.",
		example: "https://cossistant.com/avatar.png",
	}),
});

/**
 * Website information response schema
 */
export const publicWebsiteResponseSchema = z.object({
	id: z.string().ulid().openapi({
		description: "The website's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	name: z.string().openapi({
		description: "The website's name.",
		example: "Dub",
	}),
	domain: z.string().openapi({
		description: "The website's domain.",
		example: "dub.co",
	}),
	description: z.string().nullable().openapi({
		description: "The website's description.",
		example: "Link management for modern marketing teams.",
	}),
	logoUrl: z.string().nullable().openapi({
		description: "The website's logo URL.",
		example: "https://dub.co/logo.png",
	}),
	organizationId: z.string().ulid().openapi({
		description: "The organization's unique identifier.",
		example: "01JG000000000000000000000",
	}),
	status: z.string().openapi({
		description: "The website's status.",
		example: "active",
	}),
	lastOnlineAt: z.string().datetime().nullable().openapi({
		description: "The website's support last online date.",
		example: "2021-01-01T00:00:00.000Z",
	}),
	availableHumanAgents: z.array(availableHumanAgentSchema),
	availableAIAgents: z.array(AvailableAIAgentSchema),
	visitor: z
		.object({
			id: z.string().ulid().openapi({
				description: "The visitor's unique identifier (ULID).",
				example: "01JG000000000000000000000",
			}),
			createdAt: z.string().datetime().openapi({
				description: "When the visitor was first seen.",
				example: "2021-01-01T00:00:00.000Z",
			}),
		})
		.openapi({
			description:
				"The visitor information. Either existing visitor data or newly created visitor.",
		}),
});

export type PublicWebsiteResponse = z.infer<typeof publicWebsiteResponseSchema>;
export type AvailableHumanAgent = z.infer<typeof availableHumanAgentSchema>;
export type AvailableAIAgent = z.infer<typeof AvailableAIAgentSchema>;
