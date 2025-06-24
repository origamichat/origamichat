"use client";

import { signIn } from "@/lib/auth/client";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { DiscordIcon } from "../auth/sign-in-buttons";
import { Button } from "../ui/button";

export function JoinWaitlistButton({ totalEntries }: { totalEntries: number }) {
  const [from] = useQueryState("from", { defaultValue: "" });

  useEffect(() => {
    if (from) {
      // set from ref in local storage
      localStorage.setItem("from", from);
    }
  }, [from]);

  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <Button
        size="lg"
        onClick={() =>
          signIn.social({
            provider: "discord",
            callbackURL: "/joined",
            errorCallbackURL: "/joined/error",
          })
        }
      >
        <DiscordIcon className="size-5" />
        Join the waitlist with Discord
      </Button>
      <p className="flex items-center gap-4 text-sm text-primary/60">
        <span>{totalEntries} people are already on the waitlist</span>
      </p>
    </div>
  );
}
