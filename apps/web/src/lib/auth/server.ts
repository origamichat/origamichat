import { headers } from "next/headers";
import type { OrigamiUser, OrigamiSession } from "@origamichat/database";

import { getAPIBaseUrl } from "@/lib/url";
import { redirect } from "next/navigation";

export async function getAuth(): Promise<{
  user: OrigamiUser | null;
  session: OrigamiSession | null;
}> {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie");

    const session = await fetch(getAPIBaseUrl("/auth/get-session"), {
      headers: {
        "Content-Type": "application/json",
        cookie: cookie ?? "",
      },
      credentials: "include",
      cache: "no-store",
    }).then((res) => res.json());

    console.log("session", session);
    return session ?? { user: null, session: null };
  } catch (error) {
    console.error(error);
    return { user: null, session: null };
  }
}

type EnsurePageAuthProps = {
  redirectTo: string;
};

export const ensurePageAuth = async (
  props: EnsurePageAuthProps = { redirectTo: "/" }
) => {
  const { session, user } = await getAuth();

  if (!user || !session) {
    redirect(props.redirectTo);
  }

  return { session, user };
};
