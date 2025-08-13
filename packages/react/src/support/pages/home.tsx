import { SenderType } from "@cossistant/types";
import type React from "react";
import { useSupport } from "../..";
import { MessageList } from "../components";
import { AvatarStack } from "../components/avatar-stack";
import { Header } from "../components/header";
import { Watermark } from "../components/watermark";

export type HomePageProps = {
  onStartConversation: (message: string) => void;
};

export const HomePage: React.FC<HomePageProps> = ({ onStartConversation }) => {
  const { website, defaultMessages } = useSupport();

  const availableHumanAgents = website?.availableHumanAgents || [];
  const availableAIAgents = website?.availableAIAgents || [];

  const messages = defaultMessages || [
    {
      content: "Hi 👋 How can we help you today?",
      senderType: SenderType.TEAM_MEMBER,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      <Header>
        <div className="flex items-center gap-2 py-3">
          <AvatarStack
            aiAgents={website?.availableAIAgents || []}
            humanAgents={availableHumanAgents}
          />
          <div className="flex flex-col">
            <p className="font-medium text-sm">{website?.name}</p>
            <p className="text-muted-foreground text-sm">Support online</p>
          </div>
        </div>
      </Header>
      <div className="flex-1">
        <MessageList
          availableAIAgents={availableAIAgents}
          availableHumanAgents={availableHumanAgents}
          className="min-h-0 flex-1"
          events={[]}
          messages={messages.map((message, index) => ({
            content: message.content,
            type: "text",
            id: `message-${index}`,
            createdAt: new Date(),
            conversationId: "1",
            updatedAt: new Date(),
            deletedAt: null,
            userId:
              message.senderType === SenderType.TEAM_MEMBER
                ? availableHumanAgents[0]?.id || null
                : null,
            aiAgentId:
              message.senderType === SenderType.AI
                ? availableAIAgents[0]?.id || null
                : null,
            visitorId: null,
            visibility: "public",
          }))}
        />
      </div>
      <Watermark className="mx-auto mb-3 opacity-80" />
    </div>
  );
};
