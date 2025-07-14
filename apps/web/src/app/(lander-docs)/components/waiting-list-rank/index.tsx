import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DISCORD_INVITE } from "@/constants";
import { getAuth } from "@/lib/auth/server";
import { trpc } from "@/lib/trpc/server";
import { getWaitlistUrl } from "@/lib/url";
import { cn } from "@/lib/utils";
import { DiscordIcon } from "../login-form";

export async function WaitingListRank({ className }: { className?: string }) {
	const { user } = await getAuth();

	const { entry, rank, totalEntries } =
		await trpc.waitlist.getWaitlistEntry.query({ userId: user?.id });

	if (!entry) {
		redirect("/waitlist");
	}

	const url = getWaitlistUrl(entry.uniqueReferralCode);

	return (
		<>
			<div
				className={cn(
					"mx-auto flex w-full max-w-[592px] flex-col gap-4 rounded py-10 md:p-10",
					className
				)}
			>
				<div className="flex items-center gap-10">
					<div className="flex flex-col gap-2">
						<p className="text-primary/60 text-sm">Your points</p>
						<p className="font-medium font-mono text-3xl text-primary">
							{entry.points}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-primary/60 text-sm">Your rank</p>
						<p className="font-medium font-mono text-3xl text-primary">
							{rank}{" "}
							<span className="text-primary/60 text-sm">/ {totalEntries}</span>
						</p>
					</div>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="flex size-6 items-center justify-center rounded border border-os-background-400 bg-os-background-300 font-medium text-primary/70 text-xs">
							1
						</span>
						<p className="font-medium text-sm">Share with others</p>
						<span className="ml-4 text-primary/70 text-xs">
							+5 points/referral
						</span>
					</div>
					<div className="relative mb-6" id="link-input">
						<Input readOnly type="text" value={url} />
						<div className="pointer-events-none absolute top-[4px] right-[1px] bottom-[4px] w-60 rounded-r-xl bg-gradient-to-l from-os-background to-transparent" />
						<div className="pointer-events-none absolute top-[4px] right-[1px] bottom-[4px] w-60 rounded-r-xl bg-gradient-to-l from-os-background to-transparent" />
						<CopyButton
							className="-translate-y-1/2 absolute top-1/2 right-1"
							size="sm"
							value={url}
							variant="ghost"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="flex size-6 items-center justify-center rounded border border-os-background-400 bg-os-background-300 font-medium text-primary/70 text-xs">
							2
						</span>
						<p className="font-medium text-sm">Join our Discord</p>
						<span className="ml-4 text-primary/70 text-xs">+2 points</span>
					</div>
					<Link
						className="mb-6 text-primary/80 text-sm hover:text-primary"
						href={DISCORD_INVITE}
					>
						<Button className="min-h-9" size="sm" variant="outline">
							<DiscordIcon className="size-4" />
							Go to Discord server
						</Button>
					</Link>
				</div>
				{/* {entry.user.stripeCustomerId && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded size-6 border border-os-background-400">
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
