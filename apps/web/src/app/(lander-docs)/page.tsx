import { WaitingList } from "@/app/(lander-docs)/components/waiting-list";
import { ComponentPreview } from "@/components/component-preview";
import { DemoSupportWidget } from "@/components/support/widget";

// Force dynamic rendering since this page depends on user authentication
export const dynamic = "force-dynamic";

export default function Landing() {
  return (
    <>
      <div className="container mx-auto flex min-h-screen flex-col gap-8 pt-32 md:flex-row md:items-center md:pt-0">
        <div className="flex flex-1 items-center justify-start">
          <div className="flex flex-col gap-4">
            <h1 className="font-f37-stout text-4xl">
              The AI-powered developer experience
            </h1>
            <p className="text-base text-foreground/60">
              Consistent is the open-source AI support framework that lives
              inside your product — not trapped in a floating iframe.
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-start">
          <ComponentPreview name="support-widget" withOrnament />
        </div>
      </div>
    </>
  );
}
