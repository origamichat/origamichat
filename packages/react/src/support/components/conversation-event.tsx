import type {
  AvailableAIAgent,
  AvailableHumanAgent,
  ConversationEvent as ConversationEventType,
} from "@cossistant/types";
import { motion } from "motion/react";
import type React from "react";
import { Avatar } from "./avatar";
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
  const aiAgent = availableAIAgents.find(
    (agent) => agent.id === event.actorAiAgentId
  );

  // Get the actor name
  const actorName = isAI 
    ? (aiAgent?.name || "Cossistant")
    : (humanAgent?.name || "Someone");

  // Convert event type to plain English
  const getEventText = () => {
    switch (event.type) {
      case "assigned":
        return `${actorName} assigned the conversation`;
      case "unassigned":
        return `${actorName} unassigned the conversation`;
      case "participant_requested":
        return `${actorName} requested to join`;
      case "participant_joined":
        return `${actorName} joined the conversation`;
      case "participant_left":
        return `${actorName} left the conversation`;
      case "status_changed":
        return `${actorName} changed the status`;
      case "priority_changed":
        return `${actorName} changed the priority`;
      case "tag_added":
        return `${actorName} added a tag`;
      case "tag_removed":
        return `${actorName} removed a tag`;
      case "resolved":
        return `${actorName} resolved the conversation`;
      case "reopened":
        return `${actorName} reopened the conversation`;
      default:
        return `${actorName} performed an action`;
    }
  };

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
            <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
              <CossistantLogo className="h-3 w-3 text-primary" />
            </div>
          ) : (
            <Avatar
              className="size-5 flex-shrink-0 overflow-clip rounded-full"
              image={humanAgent?.image}
              name={humanAgent?.name ?? "Someone"}
            />
          )}
        </div>
        <span className="px-2">{getEventText()}</span>
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
