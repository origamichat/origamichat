import { CopyButton } from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getWaitlistUrl } from "@/lib/url";
import { JoinWaitlistButton } from "./join-button";
import { Separator } from "@/components/ui/separator";
import { db } from "@cossistant/database";
import { getWaitlistEntryByUserId } from "@cossistant/api/queries";
import { DISCORD_INVITE } from "@/constants";
import { DiscordIcon } from "../auth/sign-in-buttons";
import { getAuth } from "@/lib/auth/server";

export async function WaitingList({ className }: { className?: string }) {
  const { user } = await getAuth();

  const { entry, rank, totalEntries } = await getWaitlistEntryByUserId(db, {
    userId: user?.id,
  });

  if (!entry) {
    return (
      <div className="flex flex-col gap-4 py-10 md:p-10 rounded-md max-w-[592px] w-full items-center justify-center min-h-[500px] mx-auto">
        <JoinWaitlistButton totalEntries={totalEntries} />
      </div>
    );
  }

  const url = getWaitlistUrl(entry.uniqueReferralCode);

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-4 py-10 md:p-10 rounded-md max-w-[592px] w-full",
          className
        )}
      >
        <div className="flex items-center gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary/60">Your points</p>
            <p className="text-3xl text-primary font-medium font-mono">
              {entry.points}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary/60">Your rank</p>
            <p className="text-3xl text-primary font-medium font-mono">
              {rank}{" "}
              <span className="text-sm text-primary/60">/ {totalEntries}</span>
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded-md size-6 border border-os-background-400">
              1
            </span>
            <p className="font-medium text-sm">Share with your friends</p>
            <span className="text-xs text-primary/70 ml-4">
              +5 points/friend
            </span>
          </div>
          <div className="relative mb-6" id="link-input">
            <Input
              type="text"
              value={url}
              readOnly
              className="text-xs md:text-md"
            />
            <div className="pointer-events-none absolute bottom-[4px] right-[1px] top-[4px] w-60 rounded-r-xl bg-gradient-to-l from-os-background to-transparent" />
            <div className="pointer-events-none absolute bottom-[4px] right-[1px] top-[4px] w-60 rounded-r-xl bg-gradient-to-l from-os-background to-transparent" />
            <CopyButton
              value={url}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded-md size-6 border border-os-background-400">
              2
            </span>
            <p className="font-medium text-sm">Join our Discord</p>
            <span className="text-xs text-primary/70 ml-4">+2 points</span>
          </div>
          <Link
            href={DISCORD_INVITE}
            className="text-sm text-primary/80 hover:text-primary mb-6"
          >
            <Button variant="outline" size="sm" className="min-h-9">
              <DiscordIcon className="size-4" />
              Go to Discord server
            </Button>
          </Link>
        </div>
        {/* {entry.user.stripeCustomerId && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded-md size-6 border border-os-background-400">
                3
              </span>
              <p className="font-medium text-sm">Preorder AI credits</p>
              <span className="text-xs text-primary/70 ml-4">
                +1 point/credit
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Link
                href={getCheckoutUrl(
                  entry.user.stripeCustomerId,
                  STRIPE_CREDIT_PRICES[20]
                )}
              >
                <Button variant="outline" size="sm" className="min-h-9">
                  <span className="text-primary/80">$</span>20
                </Button>
              </Link>
              <Link
                href={getCheckoutUrl(
                  entry.user.stripeCustomerId,
                  STRIPE_CREDIT_PRICES[50]
                )}
              >
                <Button variant="outline" size="sm" className="min-h-9">
                  <span className="text-primary/80">$</span>50
                </Button>
              </Link>
              <Link
                href={getCheckoutUrl(
                  entry.user.stripeCustomerId,
                  STRIPE_CREDIT_PRICES[100]
                )}
              >
                <Button variant="outline" size="sm" className="min-h-9">
                  <span className="text-primary/80">$</span>100
                </Button>
              </Link>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}
