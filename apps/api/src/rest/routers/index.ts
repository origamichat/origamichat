import { OpenAPIHono } from "@hono/zod-openapi";
import {
	protectedPublicApiKeyMiddleware,
	publicMiddleware,
} from "../middleware";
import { conversationRouter } from "./conversation";
import { messagesRouter } from "./messages";
import { organizationRouter } from "./organization";
import { websiteRouter } from "./website";

const routers = new OpenAPIHono();

// Public routes (no auth required)
routers.use(...publicMiddleware);
routers.route("/organizations", organizationRouter);

// API routes that require API key authentication
routers.use("/websites", ...protectedPublicApiKeyMiddleware);
routers.route("/websites", websiteRouter);
routers.use("/messages", ...protectedPublicApiKeyMiddleware);
routers.route("/messages", messagesRouter);
routers.use("/conversations", ...protectedPublicApiKeyMiddleware);
routers.route("/conversations", conversationRouter);

export { routers };
