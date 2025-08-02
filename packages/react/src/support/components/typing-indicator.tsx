import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";

export interface TypingIndicatorProps {
	senderName?: string;
	senderImage?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
	senderName,
	senderImage,
}) => {
	return (
		<div className="flex gap-2">
			{/* Avatar positioned at bottom to match MessageGroup layout */}
			<div className="flex flex-col justify-end">
				<Avatar className="size-8 flex-shrink-0">
					{senderImage && <AvatarImage alt={senderName} src={senderImage} />}
					<AvatarFallback className="text-xs" name={senderName || "Support"} />
				</Avatar>
			</div>

			<div className="flex flex-col gap-1">
				{senderName && (
					<span className="px-1 text-muted-foreground text-xs">
						{senderName}
					</span>
				)}
				<div className="rounded-lg rounded-bl-sm bg-co-background-200 px-3 py-2">
					<div className="flex gap-1">
						<span className="animation-delay-0 size-1 animate-bounce rounded-full bg-primary" />
						<span className="animation-delay-200 size-1 animate-bounce rounded-full bg-primary" />
						<span className="animation-delay-400 size-1 animate-bounce rounded-full bg-primary" />
					</div>
				</div>
			</div>
		</div>
	);
};
