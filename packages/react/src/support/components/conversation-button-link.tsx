import type { Conversation } from "@cossistant/types";
import type React from "react";
import { useSupport } from "../..";
import { useRenderElement } from "../../utils/use-render-element";
import { cn } from "../utils";
import { formatTimeAgo } from "../utils/time";
import { Avatar } from "./avatar";
import Icon from "./icons";

export interface ConversationButtonLinkProps {
  conversation: Conversation;
  onClick?: () => void;
  className?: string | ((state: ConversationButtonLinkState) => string);
  render?: (
    props: React.HTMLProps<HTMLButtonElement>,
    state: ConversationButtonLinkState
  ) => React.ReactElement;
}

export interface ConversationButtonLinkState {
  conversation: Conversation;
  lastMessage: {
    content: string;
    time: string;
    isFromVisitor: boolean;
    senderName?: string;
    senderImage?: string | null;
  } | null;
}

function getLastMessageInfo(
  message: NonNullable<Conversation["lastMessage"]>,
  availableHumanAgents: ReturnType<typeof useSupport>["availableHumanAgents"],
  website: ReturnType<typeof useSupport>["website"]
) {
  const isFromVisitor = message.visitorId !== null;

  // Find the sender information
  let senderName = "Unknown";
  let senderImage: string | null = null;

  if (isFromVisitor) {
    senderName = "You";
  } else if (message.userId) {
    // Find the human agent
    const agent = availableHumanAgents.find((a) => a.id === message.userId);
    if (agent) {
      senderName = agent.name;
      senderImage = agent.image;
    }
  } else if (message.aiAgentId && website?.availableAIAgents) {
    // Find the AI agent
    const aiAgent = website.availableAIAgents.find(
      (a) => a.id === message.aiAgentId
    );
    if (aiAgent) {
      senderName = aiAgent.name;
      senderImage = aiAgent.image;
    }
  }

  return {
    content: message.bodyMd,
    time: formatTimeAgo(message.createdAt),
    isFromVisitor,
    senderName,
    senderImage,
  };
}

export function ConversationButtonLink({
  conversation,
  onClick,
  ...props
}: ConversationButtonLinkProps) {
  const { availableHumanAgents, website } = useSupport();

  // Process the last message
  const lastMessage = conversation.lastMessage
    ? getLastMessageInfo(
        conversation.lastMessage,
        availableHumanAgents,
        website
      )
    : null;

  const state: ConversationButtonLinkState = {
    conversation,
    lastMessage,
  };

  return useRenderElement("button", props, {
    state,
    props: {
      onClick,
      type: "button",
      className: cn(
        "group/btn relative flex w-full items-start gap-2 rounded-none border-0 border-co-border/50 border-b bg-co-background-200 px-4 py-3 text-left transition-colors first-of-type:rounded-t last-of-type:rounded-b last-of-type:border-b-0 hover:bg-co-background-300 hover:text-co-foreground dark:bg-co-background-300 dark:hover:bg-co-background-400",
        typeof props.className === "function"
          ? props.className(state)
          : props.className
      ),
      children: (
        <>
          {lastMessage && !lastMessage.isFromVisitor && (
            <Avatar
              className="size-8 flex-shrink-0"
              image={lastMessage.senderImage}
              name={lastMessage.senderName || "Agent"}
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex max-w-[90%] items-baseline justify-between gap-2">
              <h3 className="truncate font-medium text-co-primary text-sm">
                {conversation.title ||
                  lastMessage?.content ||
                  "Untitled conversation"}
              </h3>
            </div>

            {lastMessage && (
              <p className="text-co-primary/60 text-xs">
                {lastMessage.isFromVisitor ? (
                  <span>You - {lastMessage.time}</span>
                ) : (
                  <span>
                    {lastMessage.senderName} - {lastMessage.time}
                  </span>
                )}
              </p>
            )}
          </div>

          <Icon
            className="-translate-y-1/2 absolute top-1/2 right-4 size-3 text-co-primary/60 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:text-co-primary"
            name="arrow-right"
            variant="default"
          />
        </>
      ),
    },
  });
}
