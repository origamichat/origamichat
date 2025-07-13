import { generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
	title: "Reset your password",
});

export default function ResetPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
