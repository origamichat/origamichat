import { OpenAPIHono } from "@hono/zod-openapi";
import type { RestContext } from "../types";

export const messagesRouter = new OpenAPIHono<RestContext>();
