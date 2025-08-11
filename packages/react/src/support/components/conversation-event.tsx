import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@cossistant/react/primitive/avatar";
import type {
	AvailableAIAgent,
	AvailableHumanAgent,
	ConversationEvent as ConversationEventType,
} from "@cossistant/types";
import { motion } from "motion/react";
import type React from "react";
import { CossistantLogo } from "./cossistant-branding";

export interface ConversationEventProps {
	event: ConversationEventType;
	availableAIAgents: AvailableAIAgent[];
	availableHumanAgents: AvailableHumanAgent[];
}

export const ConversationEvent: React.FC<ConversationEventProps> = ({
	event,
	availableAIAgents,
	availableHumanAgents,
}) => {
	const isAI = event.actorAiAgentId !== null;
	const humanAgent = availableHumanAgents.find(
		(agent) => agent.id === event.actorUserId
	);

	return (
		<motion.div
			animate={{ opacity: 1, scale: 1 }}
			className="flex items-center justify-center py-4"
			initial={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="flex flex-col justify-end">
					{isAI ? (
						<div className="flex size-5 items-center justify-center rounded bg-primary/10">
							<CossistantLogo className="h-3 w-3 text-primary" />
						</div>
					) : (
						<Avatar className="size-5 flex-shrink-0 overflow-clip rounded">
							{humanAgent?.image && (
								<AvatarImage alt={humanAgent.name} src={humanAgent.image} />
							)}
							<AvatarFallback
								className="size-5 overflow-clip rounded text-xs"
								name={humanAgent?.name || "Support"}
							/>
						</Avatar>
					)}
				</div>
				<span className="px-2">{event.type}</span>
				{event.createdAt && (
					<span className="text-[10px]">
						{new Date(event.createdAt).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				)}
			</div>
		</motion.div>
	);
};
