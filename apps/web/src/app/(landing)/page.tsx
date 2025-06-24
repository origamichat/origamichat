import { TopBar } from "./sections/top-bar";
import { ScrollSection } from "./sections/scroll-section";
import { Footer } from "./sections/footer";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { WaitingList } from "@/components/waiting-list";

// Force dynamic rendering since this page depends on user authentication
export const dynamic = "force-dynamic";

export default async function Landing() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main>
        <WaitingList className="md:mx-0 md:px-0 border-none bg-transparent md:mt-0 md:pt-0" />
        <ScrollSection />
      </main>
      <ProgressiveBlur
        className="pointer-events-none fixed top-0 left-0 right-0 w-full h-[200px] z-5"
        direction="top"
        blurIntensity={1}
      />
      <ProgressiveBlur
        className="pointer-events-none fixed bottom-0 right-0 left-0 w-full h-[200px] z-5"
        direction="bottom"
        blurIntensity={1}
      />
      <Footer />
    </div>
  );
}
