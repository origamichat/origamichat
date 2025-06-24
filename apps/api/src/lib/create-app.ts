import { Hono } from "hono";
import { auth } from "@cossistant/database";

export type AuthType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export function createRouter() {
  return new Hono<AuthType>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();

  return app;
}
