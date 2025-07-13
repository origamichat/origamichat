import { LoginForm } from "@/app/(lander-docs)/components/login-form";
import { generateSiteMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = generateSiteMetadata({
	title: "Sign in",
});

export default function LoginPage() {
	return (
		<div className="flex h-[80vh] w-full items-center justify-center">
			<LoginForm />
		</div>
	);
}
