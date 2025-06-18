import { z } from "@hono/zod-openapi";
import { WebsiteInstallationTarget, APIKeyType } from "@repo/database/enums";

export const createWebsiteRequestSchema = z.object({
  name: z.string().openapi({
    description: "The website's name.",
    example: "Dub",
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
