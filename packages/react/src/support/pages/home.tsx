import React from "react";
import { useSupport } from "../..";
import { useCreateConversation } from "../../hooks/use-create-conversation";
import { AvatarStack } from "../components/avatar-stack";
import { Button } from "../components/button";
import { Header } from "../components/header";
import Icon from "../components/icons";
import { TextEffect } from "../components/text-effect";
import { Watermark } from "../components/watermark";
import { useSupportNavigation } from "../store/support-store";

export type HomePageProps = {
  onStartConversation: (message: string) => void;

  message: string;
  files: File[];
  error: Error | null;
  setMessage: (message: string) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  submit: () => void;
  isSubmitting: boolean;
};

export const HomePage: React.FC<HomePageProps> = ({
  onStartConversation,
  message,
  files,
  isSubmitting,
  error,
  setMessage,
  addFiles,
  removeFile,
  submit,
}) => {
  const {
    website,
    availableHumanAgents,
    visitor,
    quickOptions,
    client,
    conversations,
    conversationsLoading,
    conversationsError,
  } = useSupport();
  const { navigate } = useSupportNavigation();
  const createConversation = useCreateConversation(client, {
    onSuccess: (data) => {
      // Navigate to conversation page with the new conversation ID
      navigate({
        page: "CONVERSATION",
        params: { conversationId: data.conversation.id },
      });
    },
    onError: (_error) => {
      console.error("Failed to create conversation:", _error);
    },
  });

  // Console log conversations data for debugging
  React.useEffect(() => {
    console.log("Conversations state:", {
      conversations,
      conversationsLoading,
      conversationsError,
      visitor: visitor?.id,
      client: !!client,
      website: !!website,
    });
    
    if (conversations) {
      console.log("Conversations data fetched for visitor:", conversations);
    }
    
    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError);
    }
  }, [conversations, conversationsLoading, conversationsError, visitor, client, website]);

  const handleStartConversation = (initialMessage?: string) => {
    // Create conversation with optional initial message
    // For now, we'll pass empty defaultMessages since we don't have the full message creation flow yet
    // The initial message will be sent after conversation creation
    createConversation.mutate({ defaultMessages: [] });
  };

  // const defaultMessages = useDefaultMessages({ conversationId: "default" });

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
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
                  disabled={createConversation.isPending}
                  key={option}
                  onClick={() => handleStartConversation(option)}
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
      <div className="flex flex-shrink-0 flex-col items-center justify-center gap-4 px-6 pb-4">
        <Button
          className="relative w-full"
          disabled={createConversation.isPending}
          onClick={() => handleStartConversation()}
          size="large"
        >
          <Icon
            className="-translate-y-1/2 absolute top-1/2 right-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
            name="arrow-right"
            variant="default"
          />
          {createConversation.isPending
            ? "Creating conversation..."
            : "Ask us a question"}
        </Button>
        <Watermark />
      </div>
    </div>
  );
};
