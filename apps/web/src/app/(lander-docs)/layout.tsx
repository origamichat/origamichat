import { Suspense } from "react";
import {
	DashboardButton,
	DashboardButtonSkeleton,
} from "@/app/(lander-docs)/components/topbar/dashboard-button";
import { Footer } from "./components/footer";
import { TopBar } from "./components/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="dark">
			<div className="relative flex min-h-svh flex-col overflow-clip border-grid-x">
				<TopBar>
					<Suspense fallback={<DashboardButtonSkeleton />}>
						<DashboardButton />
					</Suspense>
				</TopBar>
				<main className="flex flex-1 flex-col">
					<div className="container-wrapper mx-auto">{children}</div>
				</main>
				<Footer />
			</div>
		</div>
	);
}
