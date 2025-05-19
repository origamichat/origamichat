import { hc } from "hono/client";
import type { OrigamiAPIType } from "api";

const client = hc<OrigamiAPIType>(process.env.NEXT_PUBLIC_API_URL!, {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include",
    });
  }) as typeof fetch,
});

export default client;
