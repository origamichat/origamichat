import { TopBar } from "./sections/top-bar";
import { ScrollSection } from "./sections/scroll-section";
import { Footer } from "./sections/footer";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main></main>
      <ScrollSection />
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
