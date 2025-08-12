import { Avatar } from "@cossistant/react/support/components/avatar";
import type React from "react";
import { useSupport } from "../..";
import { Header } from "../components/header";
import { cn } from "../utils";

export type HomePageProps = {
	onStartConversation: (message: string) => void;
};

export const HomePage: React.FC<HomePageProps> = ({ onStartConversation }) => {
	const { website } = useSupport();

	const availableHumanAgents = website?.availableHumanAgents || [];

	return (
		<div className="flex h-full flex-col gap-0 overflow-hidden">
			<Header className={cn("")} onGoBack={() => {}}>
				<div className="flex items-center gap-2 px-2 py-3">
					{availableHumanAgents.map((humanAgent) => (
						<Avatar
							image={humanAgent.image}
							key={humanAgent.id}
							name={humanAgent.name}
						/>
					))}
					<div className="flex flex-col">
						<p className="font-medium text-sm">{website?.name}</p>
						<p className="text-muted-foreground text-sm">Support online</p>
					</div>
				</div>
			</Header>
			<button
				className="rounded-md bg-co-background-200 px-4 py-2 text-primary"
				onClick={() => onStartConversation("Hello")}
				type="button"
			>
				Start a new conversation
			</button>
		</div>
	);
};
