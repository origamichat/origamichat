import { getVisitor } from "@api/db/queries";
import { upsertConversation } from "@api/db/queries/conversation";
import { sendMessages } from "@api/db/queries/message";
import {
  safelyExtractRequestData,
  validateResponse,
} from "@api/utils/validate";
import {
  createConversationRequestSchema,
  createConversationResponseSchema,
} from "@cossistant/types/api/conversation";
import type { Message } from "@cossistant/types/schemas";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import type { RestContext } from "../types";

export const conversationRouter = new OpenAPIHono<RestContext>();

conversationRouter.openapi(
  {
    method: "post",
    path: "/create",
    summary: "Create a conversation with or without initial messages",
    description:
      "Create a conversation, accepts a conversation id or not and a set of default messages.",
    tags: ["Conversation", "Create"],
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: createConversationRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Conversation created",
        content: {
          "application/json": {
            schema: createConversationResponseSchema,
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
      await safelyExtractRequestData(c, createConversationRequestSchema);

    const visitor = await getVisitor(db, {
      visitorId: body.visitorId || visitorIdHeader,
      externalVisitorId: body.externalVisitorId,
    });

    if (!visitor) {
      return c.json(
        {
          error:
            "Visitor not found, please pass a valid visitorId or externalVisitorId",
        },
        400
      );
    }

    const conversation = await upsertConversation(db, {
      organizationId: organization.id,
      websiteId: website.id,
      visitorId: visitor.id,
      conversationId: body.conversationId,
    });

    let initialMessages: Message[] = [];

    if (body.defaultMessages.length > 0) {
      initialMessages = await sendMessages(db, {
        organizationId: organization.id,
        websiteId: website.id,
        conversationId: conversation.id,
        messages: body.defaultMessages,
      });
    }

    return c.json(
      validateResponse(
        {
          initialMessages,
          conversation: {
            id: conversation.id,
            organizationId: conversation.organizationId,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            visitorId: conversation.visitorId,
            websiteId: conversation.websiteId,
            status: conversation.status,
          },
        },
        createConversationResponseSchema
      )
    );
  }
);
