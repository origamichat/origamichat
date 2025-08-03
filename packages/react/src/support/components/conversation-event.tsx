import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@cossistant/react/primitive/avatar";
import { SenderType } from "@cossistant/types";
import { motion } from "motion/react";
import type React from "react";
import { CossistantLogo } from "./cossistant-branding";

export interface ConversationEventProps {
	event: string;
	timestamp?: Date;
	senderName?: string;
	senderImage?: string;
	senderType?: SenderType;
}

export const ConversationEvent: React.FC<ConversationEventProps> = ({
	event,
	timestamp,
	senderName,
	senderImage,
	senderType,
}) => {
	const isAI = senderType === SenderType.AI;
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
							{senderImage && (
								<AvatarImage alt={senderName} src={senderImage} />
							)}
							<AvatarFallback
								className="size-5 overflow-clip rounded text-xs"
								name={senderName || "Support"}
							/>
						</Avatar>
					)}
				</div>
				<span className="px-2">{event}</span>
				{timestamp && (
					<span className="text-[10px]">
						{new Date(timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				)}
			</div>
		</motion.div>
	);
};
