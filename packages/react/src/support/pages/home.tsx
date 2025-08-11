import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@cossistant/react/primitive/avatar";
import type React from "react";
import { useSupport } from "../..";
import { cn } from "../utils";

export type HomePageProps = {
	onStartConversation: (message: string) => void;
};

export const HomePage: React.FC<HomePageProps> = ({ onStartConversation }) => {
	const { website } = useSupport();

	const availableHumanAgents = website?.availableHumanAgents || [];

	return (
		<div className="flex h-full flex-col gap-0 overflow-hidden">
			<div
				className={cn(
					"flex-shrink-0 border-co-border border-b bg-co-background px-2 pt-0 shadow-xs transition-all duration-200"
				)}
			>
				<div className="flex items-center gap-2 px-2 py-3">
					{availableHumanAgents.map((humanAgent) => (
						<Avatar
							className="flex size-8 items-center justify-center overflow-clip rounded bg-co-background-200"
							key={humanAgent.id}
						>
							{humanAgent.image && (
								<AvatarImage alt={humanAgent.name} src={humanAgent.image} />
							)}
							<AvatarFallback className="text-xs" name={humanAgent.name} />
						</Avatar>
					))}
					<div className="flex flex-col">
						<p className="font-medium text-sm">{website?.name}</p>
						<p className="text-muted-foreground text-sm">Support online</p>
					</div>
				</div>
			</div>
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
