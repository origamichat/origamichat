import { OpenAPIHono } from "@hono/zod-openapi";
import type { RestContext } from "../types";
import { protectedPublicApiKeyMiddleware } from "../middleware";

export const messagesRouter = new OpenAPIHono<RestContext>();

// Apply middleware to all routes in this router
messagesRouter.use("/*", ...protectedPublicApiKeyMiddleware);
