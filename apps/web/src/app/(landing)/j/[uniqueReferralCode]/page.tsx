import { getLandingBaseUrl } from "@/lib/url";
import { redirect } from "next/navigation";

type tParams = Promise<{ uniqueReferralCode: string }>;

export default async function Page({ params }: { params: tParams }) {
  const url = new URL(getLandingBaseUrl());

  const { uniqueReferralCode } = await params;

  url.searchParams.set("from", uniqueReferralCode);

  // This page only redirect to the landing page
  redirect(url.toString());

  return <></>;
}
