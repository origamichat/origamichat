import { OpenAPIHono } from "@hono/zod-openapi";
import { protectedPublicApiKeyMiddleware } from "../middleware";
import type { RestContext } from "../types";

export const messagesRouter = new OpenAPIHono<RestContext>();

// Apply middleware to all routes in this router
messagesRouter.use("/*", ...protectedPublicApiKeyMiddleware);
