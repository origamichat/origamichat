import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { CossistantLogo } from "./cossistant-branding";

export interface TypingIndicatorProps {
	senderName?: string;
	senderImage?: string;
	isAI: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
	senderName,
	senderImage,
	isAI,
}) => {
	return (
		<div className="flex items-center gap-2">
			{/* Avatar positioned at bottom to match MessageGroup layout */}
			<div className="flex flex-col justify-end">
				{isAI ? (
					<div className="flex size-8 items-center justify-center rounded bg-primary/10">
						<CossistantLogo className="h-5 w-5 text-primary" />
					</div>
				) : (
					<Avatar className="size-8 flex-shrink-0 overflow-clip rounded">
						{senderImage && <AvatarImage alt={senderName} src={senderImage} />}
						<AvatarFallback
							className="text-xs"
							name={senderName || "Support"}
						/>
					</Avatar>
				)}
			</div>

			<div className="flex flex-col gap-1">
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
