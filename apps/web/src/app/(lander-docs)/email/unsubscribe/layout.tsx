import { generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
	title: "Unsubscribe from our mailing list",
});

export const dynamic = "force-dynamic";

export default function ResetPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
