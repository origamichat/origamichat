import { cors } from "hono/cors";

import { auth } from "@/lib/auth";

// Routers
import authRouter from "@/routes/auth";
import healthRouter from "@/routes/health";
import { Hono } from "hono";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// Cors
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Auth
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// Bind routes to /api
app.basePath("/api");

// Add routes
app.route("/auth", authRouter);
app.route("/health", healthRouter);

export default {
  port: 8787,
  fetch: app.fetch,
};

// Export the typed API RPC
export type OrigamiAPIType = typeof app;
