import { getMessages, sendMessages } from "@api/db/queries/message";
import {
  safelyExtractRequestData,
  safelyExtractRequestQuery,
  validateResponse,
} from "@api/utils/validate";
import {
  getMessagesRequestSchema,
  getMessagesResponseSchema,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
} from "@cossistant/types/api/message";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { protectedPublicApiKeyMiddleware } from "../middleware";
import type { RestContext } from "../types";

export const messagesRouter = new OpenAPIHono<RestContext>();

// Apply middleware to all routes in this router
messagesRouter.use("/*", ...protectedPublicApiKeyMiddleware);

messagesRouter.openapi(
  {
    method: "get",
    path: "/",
    summary: "Get paginated messages for a conversation",
    description:
      "Fetch messages for a specific conversation with cursor-based pagination for infinite scrolling.",
    tags: ["Messages"],
    request: {
      query: getMessagesRequestSchema,
    },
    responses: {
      200: {
        description: "Messages retrieved successfully",
        content: {
          "application/json": {
            schema: getMessagesResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: z.object({ error: z.string() }),
          },
        },
      },
    },
    security: [
      {
        "Public API Key": [],
      },
      {
        "Private API Key": [],
      },
    ],
    parameters: [
      {
        name: "Authorization",
        in: "header",
        description:
          "Private API key in Bearer token format. Use this for server-to-server authentication. Format: `Bearer sk_[live|test]_...`",
        required: false,
        schema: {
          type: "string",
          pattern: "^Bearer sk_(live|test)_[a-f0-9]{64}$",
          example:
            "Bearer sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      },
      {
        name: "X-Public-Key",
        in: "header",
        description:
          "Public API key for browser-based authentication. Can only be used from whitelisted domains. Format: `pk_[live|test]_...`",
        required: false,
        schema: {
          type: "string",
          pattern: "^pk_(live|test)_[a-f0-9]{64}$",
          example:
            "pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      },
    ],
  },
  async (c) => {
    const { db, organization, query } = await safelyExtractRequestQuery(
      c,
      getMessagesRequestSchema
    );

    const result = await getMessages(db, {
      organizationId: organization.id,
      conversationId: query.conversationId,
      limit: query.limit,
      cursor: query.cursor,
    });

    return c.json(validateResponse(result, getMessagesResponseSchema));
  }
);

messagesRouter.openapi(
  {
    method: "post",
    path: "/",
    summary: "Send a message to a conversation",
    description: "Send a new message to an existing conversation.",
    tags: ["Messages"],
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: sendMessageRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Message sent successfully",
        content: {
          "application/json": {
            schema: sendMessageResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: z.object({ error: z.string() }),
          },
        },
      },
    },
    security: [
      {
        "Public API Key": [],
      },
      {
        "Private API Key": [],
      },
    ],
    parameters: [
      {
        name: "Authorization",
        in: "header",
        description:
          "Private API key in Bearer token format. Use this for server-to-server authentication. Format: `Bearer sk_[live|test]_...`",
        required: false,
        schema: {
          type: "string",
          pattern: "^Bearer sk_(live|test)_[a-f0-9]{64}$",
          example:
            "Bearer sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      },
      {
        name: "X-Public-Key",
        in: "header",
        description:
          "Public API key for browser-based authentication. Can only be used from whitelisted domains. Format: `pk_[live|test]_...`",
        required: false,
        schema: {
          type: "string",
          pattern: "^pk_(live|test)_[a-f0-9]{64}$",
          example:
            "pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      },
      {
        name: "X-Visitor-Id",
        in: "header",
        description: "Visitor ID from localStorage.",
        required: false,
        schema: {
          type: "string",
          pattern: "^[0-9A-HJKMNP-TV-Z]{26}$",
          example: "01JG000000000000000000000",
        },
      },
    ],
  },
  async (c) => {
    const { db, website, organization, body, visitorIdHeader } =
      await safelyExtractRequestData(c, sendMessageRequestSchema);

    const visitorId = body.message.visitorId || visitorIdHeader || null;

    if (!visitorId) {
      return c.json(
        validateResponse(
          { error: "Visitor ID is required" },
          z.object({ error: z.string() })
        )
      );
    }

    const [sentMessage] = await sendMessages(db, {
      organizationId: organization.id,
      websiteId: website.id,
      conversationId: body.conversationId,
      messages: [
        {
          bodyMd: body.message.bodyMd,
          type: "text",
          userId: null,
          aiAgentId: null,
          visitorId,
          conversationId: body.conversationId,
          createdAt: new Date(),
          visibility: "public",
        },
      ],
    });

    return c.json(
      validateResponse({ message: sentMessage }, sendMessageResponseSchema)
    );
  }
);
