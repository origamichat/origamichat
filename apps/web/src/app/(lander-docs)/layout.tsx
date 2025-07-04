import { Suspense } from "react";
import {
  DashboardButton,
  DashboardButtonSkeleton,
} from "@/app/(lander-docs)/components/dashboard-button";
import { TopBar } from "./components/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar>
        <Suspense fallback={<DashboardButtonSkeleton />}>
          <DashboardButton />
        </Suspense>
      </TopBar>
      {children}
    </>
  );
}
