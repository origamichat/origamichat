import { AppLayoutSkeleton } from "@/components/ui/skeletons/app-layout-skeleton";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    organizationSlug: string;
  }>;
}>) {
  return (
    <section className="h-screen w-screen relative">
      <AppLayoutSkeleton />
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}
