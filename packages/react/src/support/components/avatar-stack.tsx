import type { AvailableAIAgent, AvailableHumanAgent } from "@cossistant/types";
import { cn } from "../utils";
import { Avatar } from "./avatar";
import { CossistantLogo } from "./cossistant-branding";

type AvatarStackProps = {
	humanAgents: AvailableHumanAgent[];
	aiAgents: AvailableAIAgent[];
	hideBranding?: boolean;
	className?: string;
};

export function AvatarStack({
	humanAgents,
	aiAgents,
	hideBranding = false,
	className,
}: AvatarStackProps) {
	const displayedHumanAgents = humanAgents.slice(0, 2);
	const remainingHumanAgentsCount = Math.max(0, humanAgents.length - 2);

	return (
		<div className="-space-x-3 -mr-1 flex items-center">
			{displayedHumanAgents.map((humanAgent) => (
				<Avatar
					className={cn("size-11 border-3 border-co-background", className)}
					image={humanAgent.image}
					key={humanAgent.id}
					name={humanAgent.name}
				/>
			))}
			{remainingHumanAgentsCount > 0 && (
				<div
					className={cn(
						"flex size-11 items-center justify-center rounded-full border-3 border-co-background bg-co-background-200 font-medium text-co-text-900 text-sm",
						className
					)}
				>
					+{remainingHumanAgentsCount}
				</div>
			)}
			<div
				className={cn(
					"flex size-11 items-center justify-center rounded-full border-3 border-co-background bg-co-background-200 dark:bg-co-background-500",
					className
				)}
			>
				<CossistantLogo className="size-5" />
			</div>
		</div>
	);
}
