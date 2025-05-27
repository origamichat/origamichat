import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { secureHeaders } from "hono/secure-headers";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import { auth } from "@repo/database";

import { origamiTRPCRouter } from "./routes";
import { routers } from "./rest/routers";

const app = new OpenAPIHono();

// Logger middleware
app.use(logger());

app.use(secureHeaders());

app.use(
  "/api/auth/*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://origami.chat",
      "https://origamichat.com",
    ],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(
  "/trpc/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "accept-language",
      "x-trpc-source",
      "x-user-locale",
      "x-user-timezone",
      "x-user-country",
    ],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: true,
  })
);

// app.use("*", async (c, next) => {
//   const session = await auth.api.getSession({ headers: c.req.raw.headers });

//   if (!session) {
//     c.set("user", null);
//     c.set("session", null);
//     return next();
//   }

//   c.set("user", session.user);
//   c.set("session", session.session);

//   return next();
// });

// Better-Auth - Handle all auth routes
app.all("/api/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

// TRPC endpoint
app.use(
  "/trpc/*",
  trpcServer({
    router: origamiTRPCRouter,
  })
);

app.route("/v1", routers);

app.doc("/openapi", {
  openapi: "3.1.0",
  info: {
    version: "0.0.1",
    title: "Origami Chat API",
  },
  servers: [
    {
      url: "https://api.origami.chat",
      description: "Production server",
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
});

app.get("/ui", swaggerUI({ url: "/openapi" }));

export default {
  port: process.env.PORT ? Number.parseInt(process.env.PORT) : 8787,
  fetch: app.fetch,
};
