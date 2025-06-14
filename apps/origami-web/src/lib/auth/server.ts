"use server";

import { headers } from "next/headers";
import { OrigamiUser, OrigamiSession, auth } from "@repo/database";

import { getAPIBaseUrl } from "@/lib/url";
import { redirect } from "next/navigation";

export async function getAuth(): Promise<{
  user: OrigamiUser | null;
  session: OrigamiSession | null;
}> {
  try {
    const headersList = await headers();

    // First try the built-in Better Auth API
    try {
      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (session) {
        console.log("session from auth.api.getSession", session);
        return session ?? { user: null, session: null };
      }
    } catch (authApiError) {
      console.warn(
        "auth.api.getSession failed, falling back to manual fetch:",
        authApiError
      );
    }

    // Fallback to manual fetch for cross-origin API calls
    const cookie = headersList.get("cookie");

    const session = await fetch(getAPIBaseUrl("/auth/get-session"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
        // Add origin header for cross-origin requests
        Origin:
          process.env.NODE_ENV === "production"
            ? "https://www.origamichat.com"
            : "http://localhost:3000",
      },
      credentials: "include",
      // Add cache control for SSR
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) {
        console.error("Session fetch failed:", res.status, res.statusText);
        return null;
      }
      return res.json();
    });

    console.log("session from manual fetch", session);

    return session ?? { user: null, session: null };
  } catch (error) {
    console.error("Both auth methods failed:", error);
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
