import { TopBar } from "@/app/(landing)/sections/top-bar";
import { TextEffect } from "@/components/ui/text-effect";

export const dynamic = "force-dynamic";

async function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 px-6 pt-20 md:pt-6">
      <TopBar />
      <div className="max-w-lg w-full flex flex-col gap-6">
        <TextEffect
          per="word"
          as="h1"
          preset="blur"
          className="text-4xl md:text-6xl font-medium md:leading-tight"
        >
          We&apos;re sorry, but there was an error.
        </TextEffect>
        <p className="text-base md:text-lg text-primary/70 mb-6">
          Please try again later or contact us on twitter @_anthonyriera
        </p>
      </div>
    </main>
  );
}

export default Page;
