import { OpenAPIHono } from "@hono/zod-openapi";
import { protectedMiddleware } from "../middleware";
import { organizationRouter } from "./organization";

const routers = new OpenAPIHono();

routers.use(...protectedMiddleware);

routers.route("/organization", organizationRouter);

export { routers };
