import {
  appendVisitorMessage,
  createConversationAndMessage,
  upsertConversation,
} from "@api/db/queries";
import { validateResponse } from "@api/utils/validate-response";
import {
  type SendMessageRequestBody,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
} from "@cossistant/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { RestContext } from "../types";

export const messagesRouter = new OpenAPIHono<RestContext>();

messagesRouter.openapi(
  {
    method: "post",
    path: "/",
    summary: "Send a message in a conversation",
    description:
      "Sends a visitor message. If conversationId is not provided, a new conversation is created and returned.",
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
        description: "Message created",
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
    ],
  },
  async (c) => {
    const db = c.get("db");
    const website = c.get("website");
    const organization = c.get("organization");

    const body = (await c.req.json()) as SendMessageRequestBody;

    // Basic validation using zod schema (in addition to OpenAPI validation)
    const parse = sendMessageRequestSchema.safeParse(body);

    if (!parse.success) {
      return c.json({ error: "Invalid request" }, 400);
    }

    const visitorIdHeader = c.req.header("X-Visitor-Id");

    const conversation = await upsertConversation(db, {
      organizationId: organization.id,
      websiteId: website.id,
      visitorId: body.visitorId,
      conversationId: body.conversationId,
    });

    if (!body.conversationId) {
      const result = await createConversationAndMessage(db, {
        organizationId: organization.id,
        websiteId: website.id,
        visitorId,
        content: body.content,
      });

      return c.json(
        validateResponse(
          {
            message: {
              id: result.message.id,
              content: result.message.content as string,
              type: result.message.type,
              userId: result.message.userId,
              aiAgentId: result.message.aiAgentId,
              visitorId: result.message.visitorId,
              conversationId: result.message.conversationId,
              createdAt: result.message.createdAt,
              updatedAt: result.message.updatedAt,
              deletedAt: result.message.deletedAt,
              visibility: result.message.visibility,
            },
            conversation: {
              id: result.conversation.id,
              title: result.conversation.title ?? undefined,
              createdAt: result.conversation.createdAt,
              updatedAt: result.conversation.updatedAt,
              visitorId: result.conversation.visitorId,
              websiteId: result.conversation.websiteId,
              organizationId: result.conversation.organizationId,
              status: result.conversation.status,
            },
          },
          sendMessageResponseSchema
        )
      );
    }

    // Append to existing conversation
    const newMessage = await appendVisitorMessage(db, {
      conversationId: body.conversationId,
      organizationId: organization.id,
      content: body.content,
    });

    return c.json(
      validateResponse(
        {
          message: {
            id: newMessage.id,
            content: newMessage.content as string,
            type: newMessage.type,
            userId: newMessage.userId,
            aiAgentId: newMessage.aiAgentId,
            visitorId: newMessage.visitorId,
            conversationId: newMessage.conversationId,
            createdAt: newMessage.createdAt,
            updatedAt: newMessage.updatedAt,
            deletedAt: newMessage.deletedAt,
            visibility: newMessage.visibility,
          },
          conversation: {
            id: body.conversationId,
            title: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            visitorId: body.visitorId,
            websiteId: website.id,
            organizationId: organization.id,
            status: ConversationStatus.OPEN,
          },
        },
        sendMessageResponseSchema
      )
    );
  }
);
