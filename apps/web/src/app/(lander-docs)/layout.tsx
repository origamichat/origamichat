import { Suspense } from "react";
import {
  DashboardButton,
  DashboardButtonSkeleton,
} from "@/app/(lander-docs)/components/dashboard-button";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Footer } from "./components/footer";
import { TopBar } from "./components/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-svh flex-col overflow-clip border-grid-x">
      <ProgressiveBlur
        blurIntensity={0.3}
        className="pointer-events-none fixed top-0 right-1 left-1 z-20 h-[80px] w-full"
        direction="top"
      />
      <ProgressiveBlur
        blurIntensity={0.3}
        className="pointer-events-none fixed right-0 bottom-1 left-1 z-20 h-[80px] w-full"
        direction="bottom"
      />
      <TopBar>
        <Suspense fallback={<DashboardButtonSkeleton />}>
          <DashboardButton />
        </Suspense>
      </TopBar>
      <main className="container-wrapper flex flex-1 flex-col">{children}</main>
      <div className="mt-40 flex w-full flex-col items-center justify-center gap-6" />
      <Footer />
    </div>
  );
}
