import { OpenAPIHono } from "@hono/zod-openapi";
import {
	protectedPublicApiKeyMiddleware,
	publicMiddleware,
} from "../middleware";
import { organizationRouter } from "./organization";
import { websiteRouter } from "./website";

const routers = new OpenAPIHono();

// Public routes (no auth required)
routers.use(...publicMiddleware);
routers.route("/organization", organizationRouter);

// API routes that require API key authentication
routers.use("/website", ...protectedPublicApiKeyMiddleware);
routers.route("/website", websiteRouter);

export { routers };
