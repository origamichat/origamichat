"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";

export function SignInButtons() {
  const handleSignIn = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
      },
      {
        credentials: "include",
      }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleSignIn}>Sign in with google</Button>
    </div>
  );
}
