import { OpenAPIHono } from "@hono/zod-openapi";
import { conversationRouter } from "./conversation";
import { messagesRouter } from "./messages";
import { organizationRouter } from "./organization";
import { websiteRouter } from "./website";

const routers = new OpenAPIHono()
  .route("/organizations", organizationRouter)
  .route("/websites", websiteRouter)
  .route("/messages", messagesRouter)
  .route("/conversations", conversationRouter);

export { routers };
