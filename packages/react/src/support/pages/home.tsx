import type React from "react";
import { useSupport } from "../..";
import { PENDING_CONVERSATION_ID } from "../../utils/id";
import { AvatarStack } from "../components/avatar-stack";
import { Button } from "../components/button";
import { ConversationButtonLink } from "../components/conversation-button-link";
import { Header } from "../components/header";
import Icon from "../components/icons";
import { TextEffect } from "../components/text-effect";
import { Watermark } from "../components/watermark";
import { useSupportNavigation } from "../store/support-store";

export const HomePage = () => {
  const {
    website,
    availableHumanAgents,
    visitor,
    quickOptions,
    conversations,
  } = useSupport();
  const { navigate } = useSupportNavigation();

  const handleStartConversation = (initialMessage?: string) => () =>
    navigate({
      page: "CONVERSATION",
      params: {
        conversationId: PENDING_CONVERSATION_ID,
        initialMessage,
      },
    });

  const handleOpenConversation = (conversationId: string) => () =>
    navigate({
      page: "CONVERSATION",
      params: {
        conversationId,
      },
    });

  // const defaultMessages = useDefaultMessages({ conversationId: "default" });

  return (
    <div className="relative flex h-full flex-col gap-10 overflow-y-auto">
      <Header>{/* <NavigationTab /> */}</Header>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <AvatarStack
            aiAgents={website?.availableAIAgents || []}
            className="size-14"
            humanAgents={availableHumanAgents}
          />
          <p className="mb-4 text-co-primary/80 text-sm">
            {website?.name} support
          </p>
          <TextEffect
            as="h2"
            className="max-w-xs text-balance text-center font-co-sans text-2xl leading-normal"
            delay={0.5}
            preset="fade-in-blur"
          >
            Good morning{visitor?.name ? ` ${visitor.name}` : ""}, How can we
            help?
          </TextEffect>

          {quickOptions.length > 0 && (
            <div className="mt-6 inline-flex gap-2">
              {quickOptions?.map((option) => (
                <Button
                  className="rounded-full"
                  key={option}
                  onClick={handleStartConversation(option)}
                  size="default"
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-center justify-center gap-2 px-6 pb-4">
        {(conversations?.length || 0) > 0 && (
          <div className="flex w-full flex-col rounded border border-co-border/50">
            {conversations?.map((conversation) => (
              <ConversationButtonLink
                conversation={conversation}
                key={conversation.id}
                onClick={handleOpenConversation(conversation.id)}
              />
            ))}
          </div>
        )}

        <Button
          className="relative w-full justify-between"
          onClick={handleStartConversation()}
          size="large"
          variant="secondary"
        >
          <Icon
            className="-translate-y-1/2 absolute top-1/2 right-4 size-3 text-co-primary/60 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:text-co-primary"
            name="arrow-right"
            variant="default"
          />
          Ask us a question
        </Button>
        <Watermark className="mt-4 mb-2" />
      </div>
    </div>
  );
};
