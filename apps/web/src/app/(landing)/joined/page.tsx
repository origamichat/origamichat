import { TopBar } from "@/app/(landing)/sections/top-bar";
import RegisterReferral from "@/components/waiting-list/register-referral";

import { WaitingList } from "@/components/waiting-list";
import { WaitingListSkeleton } from "@/components/waiting-list/waiting-list-skeleton";
import { Suspense } from "react";
import { TextEffect } from "@/components/ui/text-effect";

export const dynamic = "force-dynamic";

async function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 pt-20 md:pt-6">
      <TopBar />
      <RegisterReferral />
      <div className="max-w-lg w-full flex flex-col gap-6">
        <TextEffect
          per="word"
          as="h1"
          preset="blur"
          className="text-4xl md:text-6xl font-medium md:leading-tight text-balance"
        >
          You&apos;re on the waitlist my friend!
        </TextEffect>
        <p className="text-base md:text-lg text-primary/70 mb-6">
          We&apos;ll notify you by email as soon as the waitlist opens. You want
          to go to the top of the waitlist? here&apos;s how to do it:
        </p>
      </div>
      <Suspense fallback={<WaitingListSkeleton />}>
        <WaitingList />
      </Suspense>
    </main>
  );
}

export default Page;
