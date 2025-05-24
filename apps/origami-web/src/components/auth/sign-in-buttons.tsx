"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";

export function SignInButtons() {
  const handleSignIn = async () => {
    const data = await signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
    });

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleSignIn}>Sign in with google</Button>
    </div>
  );
}
