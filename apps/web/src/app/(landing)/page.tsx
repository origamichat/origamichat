import { TopBar } from "./sections/top-bar";
import { ScrollSection } from "./sections/scroll-section";
import { Footer } from "./sections/footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main>
        <ScrollSection />
      </main>
      <Footer />
    </div>
  );
}
