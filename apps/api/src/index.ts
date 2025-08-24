import { env } from "@api/env";
import { auth } from "@api/lib/auth";
import { routers } from "@api/rest/routers";
import { createTRPCContext } from "@api/trpc/init";
import { origamiTRPCRouter } from "@api/trpc/routers/_app";
import { checkHealth } from "@api/utils/health";
import { swaggerUI } from "@hono/swagger-ui";
import { trpcServer } from "@hono/trpc-server";
import { OpenAPIHono } from "@hono/zod-openapi";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { workflowsRouters } from "./workflows";

import { upgradedWebsocket, websocket } from "./ws/socket";

const app = new OpenAPIHono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const acceptedOrigins = [
  "http://localhost:3000",
  "https://cossistant.com",
  "https://www.cossistant.com",
  "https://cossistant.com",
  "https://www.cossistant.com",
  "http://localhost:8081",
  "https://qstash.upstash.io",
];

// Logger middleware
app.use(logger());

// Secure headers middleware
app.use(secureHeaders());

// Health check endpoint
app.get("/health", async (c) => {
  try {
    const health = await checkHealth();
    return c.json({ status: "healthy" }, health ? 200 : 503);
  } catch (_error) {
    return c.json(
      { status: "unhealthy", error: "Database connection failed" },
      503
    );
  }
});

// CORS middleware for auth and TRPC endpoints (trusted domains only)
app.use(
  "/api/auth/*",
  cors({
    origin: acceptedOrigins,
    maxAge: 86_400,
    credentials: true,
  })
);

app.use(
  "/trpc/*",
  cors({
    origin: acceptedOrigins,
    maxAge: 86_400,
    credentials: true,
  })
);

// CORS middleware for V1 API (public access)
app.use(
  "/v1/*",
  cors({
    origin: "*",
    maxAge: 86_400,
    credentials: false,
  })
);

app.use("/trpc/*", async (c, next) => {
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

app.all("/api/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

// TRPC routes
app.use(
  "/trpc/*",
  trpcServer({
    router: origamiTRPCRouter,
    createContext: createTRPCContext,
  })
);

app.route("/v1", routers);

// Upstash Workflows routes
app.route("/workflow", workflowsRouters);

// WebSocket endpoint for real-time communication
app.get("/ws", upgradedWebsocket);

app.doc("/openapi", {
  openapi: "3.1.0",
  info: {
    version: "0.0.1",
    title: "Cossistant API",
    description: "Cossistant API",
    license: {
      name: "AGPL-3.0 license",
      url: "https://github.com/cossistantcom/cossistant/blob/main/LICENSE",
    },
  },
  servers: [
    {
      url: "https://api.cossistant.com/v1",
      description: "Production server",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
});

app.get(
  "/docs",
  swaggerUI({
    url: "/openapi",
  })
);

export default {
  port: env.PORT,
  fetch: app.fetch,
  websocket,
};
