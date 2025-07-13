import { generateSiteMetadata } from "@/lib/metadata";

export const metadata = generateSiteMetadata({
	title: "Forgot your password?",
});

export default function ForgotPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
