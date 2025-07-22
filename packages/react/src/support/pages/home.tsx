import type React from "react";
import { useSupport } from "../..";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { Container } from "../components/container";
import { useSupportConfig } from "../context/config";
import { useSupportNavigation } from "../context/navigation";

export const HomePage: React.FC = () => {
	const { content } = useSupportConfig();

	return (
		<>
			<Container className="p-8">
				<Avatar className="flex size-12 items-center justify-center rounded-full border bg-co-background-200">
					<AvatarImage alt="John Doe" src="https://example.com/avatar.jpg" />
					<AvatarFallback className="text-xs" name="John Doe" />
				</Avatar>
				<h2 className="mb-2.5 font-medium text-2xl text-primary">
					{content.home?.header || "Hi there! 👋"}
				</h2>
				<p className="mb-5 text-balance text-primary/60">
					{content.home?.subheader ||
						"Need help? Our AI and human customer support is here to help you."}
				</p>
				<div className="flex-1" />
			</Container>
		</>
	);
};
