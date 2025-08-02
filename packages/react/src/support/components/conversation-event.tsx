import type React from "react";

export interface ConversationEventProps {
	event: string;
	timestamp?: Date;
}

export const ConversationEvent: React.FC<ConversationEventProps> = ({
	event,
	timestamp,
}) => {
	return (
		<div className="flex items-center justify-center py-2">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px max-w-[80px] flex-1 bg-border" />
				<span className="px-2">{event}</span>
				{timestamp && (
					<span className="text-xs">
						{new Date(timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				)}
				<div className="h-px max-w-[80px] flex-1 bg-border" />
			</div>
		</div>
	);
};
