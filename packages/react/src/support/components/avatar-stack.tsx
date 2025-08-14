import type { AvailableAIAgent, AvailableHumanAgent } from "@cossistant/types";
import { Avatar } from "./avatar";
import { CossistantLogo } from "./cossistant-branding";

type AvatarStackProps = {
  humanAgents: AvailableHumanAgent[];
  aiAgents: AvailableAIAgent[];
  hideBranding?: boolean;
};

export function AvatarStack({
  humanAgents,
  aiAgents,
  hideBranding = false,
}: AvatarStackProps) {
  const displayedHumanAgents = humanAgents.slice(0, 2);
  const remainingHumanAgentsCount = Math.max(0, humanAgents.length - 2);

  return (
    <div className="-space-x-3 flex items-center">
      {displayedHumanAgents.map((humanAgent) => (
        <Avatar
          className="size-11 border-3 border-co-background"
          image={humanAgent.image}
          key={humanAgent.id}
          name={humanAgent.name}
        />
      ))}
      {remainingHumanAgentsCount > 0 && (
        <div className="flex size-11 items-center justify-center rounded-full border-3 border-co-background bg-co-background-200 font-medium text-co-text-900 text-sm">
          +{remainingHumanAgentsCount}
        </div>
      )}
      <div className="flex size-11 items-center justify-center rounded-full border-3 border-co-background bg-co-background-200 dark:bg-co-background-500">
        <CossistantLogo className="size-5" />
      </div>
    </div>
  );
}
