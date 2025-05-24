import { headers } from "next/headers";
import { OrigamiUser, OrigamiSession } from "api";

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
    }).then((res) => res.json());

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
  props: EnsurePageAuthProps = { redirectTo: "/sign-in" }
) => {
  const { session, user } = await getAuth();

  if (!user || !session) {
    redirect(props.redirectTo);
  }

  return { session, user };
};
