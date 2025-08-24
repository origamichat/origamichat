import Icon from "@/components/ui/icons";
import { Page } from "@/components/ui/layout";
import { Header } from "@/components/ui/layout/header";
import { TextEffect } from "@/components/ui/text-effect";
import { ensureWebsiteAccess } from "@/lib/auth/website-access";

interface DashboardPageProps {
  params: Promise<{
    websiteSlug: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { websiteSlug } = await params;
  const { user, website } = await ensureWebsiteAccess(websiteSlug);

  return (
    <>
      <Header>Dashboard</Header>
      <Page>
        <div className="flex flex-col gap-2 font-medium">
          <TextEffect className="font-normal text-3xl">
            Welcome {user.name?.split(" ")[0] || "there"},
          </TextEffect>
          <p className="text-base text-primary/70">
            Here&apos;s what&apos;s happening with{" "}
            {website?.name || "your website"}.
          </p>
        </div>
      </Page>
    </>
  );
}
