import type {
  ConversationEvent,
  Message as MessageType,
  SenderType,
} from "@cossistant/types";
import type React from "react";
import { useEffect, useState } from "react";
import { useSupport } from "../..";
import { Avatar } from "../components/avatar";
import { AvatarStack } from "../components/avatar-stack";
import { Header } from "../components/header";
import { MessageList } from "../components/message-list";
import { MultimodalInput } from "../components/multimodal-input";
import { cn } from "../utils";

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
  const { website, availableAIAgents, availableHumanAgents } = useSupport();

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      <Header>
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
        messages={messages}
      />

      <div className="flex-shrink-0 px-2 pb-2">
        <MultimodalInput
          disabled={isSubmitting}
          error={error}
          files={files}
          isSubmitting={isSubmitting}
          onChange={setMessage}
          onFileSelect={addFiles}
          onRemoveFile={removeFile}
          onSubmit={submit}
          placeholder="Type your message..."
          value={message}
        />
      </div>
    </div>
  );
};
