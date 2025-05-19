import { cors } from "hono/cors";

import createApp from "@/lib/create-app";
import auth from "@/routes/auth";
import health from "@/routes/health";

const app = createApp();

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

const routes = [auth, health] as const;

// Bind routes to the app with auth
routes.forEach((route) => {
  app.basePath("/api").route("/", route);
});

export default {
  port: 8787,
  fetch: app.fetch,
};

export type OrigamiAPIType = (typeof routes)[number];
