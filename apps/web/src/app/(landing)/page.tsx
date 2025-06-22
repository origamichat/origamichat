import { Topbar } from "./sections/topbar";
import { ScrollSection } from "./sections/scroll-section";
import { Footer } from "./sections/footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main>
        <ScrollSection />
      </main>
      <Footer />
    </div>
  );
}
