import { useDefaultMessages } from "@cossistant/react/support/hooks/use-default-messages";
import type {
  ConversationEvent,
  Message as MessageType,
} from "@cossistant/types";
import React from "react";
import { useSupport } from "../..";
import { PENDING_CONVERSATION_ID } from "../../utils/id";
import { AvatarStack } from "../components/avatar-stack";
import { Header } from "../components/header";
import { MessageList } from "../components/message-list";
import { MultimodalInput } from "../components/multimodal-input";
import { useMessages } from "../hooks/use-messages";
import { useSendMessage } from "../hooks/use-send-message";
import { useSupportNavigation } from "../store";

interface ConversationPageProps {
  conversationId: string;
  message: string;
  files: File[];
  isSubmitting: boolean;
  error: Error | null;
  setMessage: (message: string) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  submit: () => void;
  messages?: MessageType[];
  events: ConversationEvent[];
}

export const ConversationPage: React.FC<ConversationPageProps> = ({
  conversationId,
  message,
  files,
  isSubmitting,
  error,
  setMessage,
  addFiles,
  removeFile,
  submit,
  messages = [],
  events = [],
}) => {
  const { website, availableAIAgents, availableHumanAgents, client, visitor } =
    useSupport();
  const { navigate } = useSupportNavigation();

  // Determine if we have a real conversation or pending one
  const hasRealConversation = conversationId !== PENDING_CONVERSATION_ID;
  const realConversationId = hasRealConversation ? conversationId : null;
  const defaultMessages = useDefaultMessages({
    conversationId,
  });

  // Fetch conversation data only if we have a real conversation
  // const {
  //   conversation,
  //   // isLoading: conversationLoading,
  //   error: conversationError,
  // } = useConversation(client, realConversationId);

  // Fetch messages - for pending conversations, we use defaultMessages
  const {
    data: fetchedMessages,
    // isLoading: messagesLoading,
    error: messagesError,
  } = useMessages({
    client,
    conversationId,
    defaultMessages,
  });

  const sendMessage = useSendMessage(client);

  const handleSubmit = React.useCallback(() => {
    if (!message.trim() && files.length === 0) {
      return;
    }

    sendMessage.mutate({
      conversationId: realConversationId,
      message: message.trim(),
      files,
      defaultMessages,
      visitorId: visitor?.id,
      onSuccess: (newConversationId, messageId) => {
        // If we created a new conversation, navigate to it
        if (
          !hasRealConversation &&
          newConversationId !== PENDING_CONVERSATION_ID
        ) {
          navigate({
            page: "CONVERSATION",
            params: { conversationId: newConversationId },
          });
        }

        setMessage("");
      },
      onError: (_error) => {
        console.error("Failed to send message:", _error);
      },
    });
  }, [
    message,
    files,
    realConversationId,
    hasRealConversation,
    defaultMessages,
    visitor?.id,
    sendMessage,
    navigate,
    setMessage,
  ]);

  // Use our custom submit handler instead of the passed one
  const actualMessages = fetchedMessages || messages;
  const actualIsSubmitting = isSubmitting || sendMessage.isPending;
  const actualError = error || messagesError;

  const goHome = () => {
    navigate({
      page: "HOME",
    });
  };

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      <Header onGoBack={goHome}>
        <div className="flex w-full items-center justify-between gap-2 py-3">
          <div className="flex flex-col">
            <p className="font-medium text-sm">{website?.name}</p>
            <p className="text-muted-foreground text-sm">Support online</p>
          </div>
          <AvatarStack
            aiAgents={availableAIAgents}
            humanAgents={availableHumanAgents}
          />
        </div>
      </Header>

      <MessageList
        availableAIAgents={availableAIAgents}
        availableHumanAgents={availableHumanAgents}
        className="min-h-0 flex-1"
        events={events}
        messages={actualMessages}
      />

      <div className="flex-shrink-0 p-1">
        <MultimodalInput
          disabled={actualIsSubmitting}
          error={actualError}
          files={files}
          isSubmitting={actualIsSubmitting}
          onChange={setMessage}
          onFileSelect={addFiles}
          onRemoveFile={removeFile}
          onSubmit={handleSubmit}
          placeholder="Type your message..."
          value={message}
        />
      </div>
    </div>
  );
};
