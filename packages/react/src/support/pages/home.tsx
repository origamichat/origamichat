import { useDefaultMessages } from "@cossistant/react/hooks/use-default-messages";
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
  const { website, availableAIAgents, availableHumanAgents } = useSupport();
  const defaultMessages = useDefaultMessages({ conversationId: "default" });

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      <Header>
        <div className="flex w-full items-center justify-between gap-2 py-3">
          <div className="flex flex-col">
            <p className="font-medium text-sm">{website?.name}</p>
            <p className="text-muted-foreground text-sm">Support online</p>
          </div>
          <AvatarStack
            aiAgents={website?.availableAIAgents || []}
            humanAgents={availableHumanAgents}
          />
        </div>
      </Header>
      <div className="flex-1">
        <MessageList
          availableAIAgents={availableAIAgents}
          availableHumanAgents={availableHumanAgents}
          className="min-h-0 flex-1"
          events={[]}
          messages={defaultMessages}
        />
      </div>
      <Watermark className="mx-auto mb-3 opacity-80" />
    </div>
  );
};
