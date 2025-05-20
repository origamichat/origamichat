import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import { auth } from "@/lib/auth";

// Routers
import authRouter from "@/routes/auth";
import healthRouter from "@/routes/health";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .doc("/doc", {
    info: {
      title: "An API",
      version: "v1",
    },
    openapi: "3.1.0",
  })
  .use(
    "*",
    cors({
      origin: "*",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  })
  .route("/api/auth", authRouter)
  .route("/api/health", healthRouter)
  .get(
    "/ui",
    swaggerUI({
      url: "/doc",
    })
  );

export default {
  port: 8787,
  fetch: app.fetch,
};

// Export the typed API RPC
export type OrigamiAPIType = typeof app;
