import type React from "react";
import { useSupport } from "../..";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { Container } from "../components/container";
import { Watermark } from "../components/watermark";
import { useSupportConfig } from "../context/config";

export const HomePage: React.FC = () => {
	const { content } = useSupportConfig();
	const { website } = useSupport();

	const availableAgents = website?.availableAgents || [];

	return (
		<>
			<Container className="flex h-full flex-col px-2 pt-6 pb-2">
				<div className="flex flex-col gap-2.5 px-4">
					{availableAgents.map((agent) => (
						<Avatar
							className="mb-10 flex size-14 items-center justify-center overflow-clip rounded-full border bg-co-background-200"
							key={agent.id}
						>
							{agent.image && (
								<AvatarImage alt={agent.name} src={agent.image} />
							)}
							<AvatarFallback className="text-xs" name={agent.name} />
						</Avatar>
					))}
					<div className="flex flex-col gap-2.5 px-1">
						<h2 className="mb-2.5 font-medium text-2xl text-primary">
							{content.home?.header || "Hi there! 👋"}
						</h2>
						<p className="mb-5 text-balance text-primary/80">
							{content.home?.subheader ||
								"Need help? Our AI and human customer support is here to help you."}
						</p>
					</div>
				</div>
				<div className="flex-1" />
				<Watermark className="mx-auto" />
			</Container>
		</>
	);
};
