import { Suspense } from "react";
import {
  DashboardButton,
  DashboardButtonSkeleton,
} from "@/components/auth/dashboard-button";
import { TopBar } from "./sections/top-bar";

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
