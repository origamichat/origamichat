import type React from "react";
import { ArticlesPage } from "./pages/articles";
import { ConversationPage } from "./pages/conversation";
import { ConversationHistoryPage } from "./pages/conversation-history";
import { HomePage } from "./pages/home";
import { useSupportNavigation } from "./store/support-store";

export const SupportRouter: React.FC<{
  message: string;
  files: File[];
  isSubmitting: boolean;
  error: Error | null;
  setMessage: (message: string) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  submit: () => void;
}> = ({
  message,
  files,
  isSubmitting,
  error,
  setMessage,
  addFiles,
  removeFile,
  submit,
}) => {
  const { current } = useSupportNavigation();

  switch (current.page) {
    case "HOME":
      return (
        <HomePage
          addFiles={addFiles}
          error={error}
          files={files}
          isSubmitting={isSubmitting}
          message={message}
          onStartConversation={() => {}}
          removeFile={removeFile}
          setMessage={setMessage}
          submit={submit}
        />
      );

    case "ARTICLES":
      return <ArticlesPage />;

    case "CONVERSATION":
      // TypeScript knows current.params exists and has conversationId here
      return (
        <ConversationPage
          addFiles={addFiles}
          conversationId={current.params.conversationId}
          error={error}
          events={[]}
          files={files}
          isSubmitting={isSubmitting}
          message={message}
          messages={[]}
          removeFile={removeFile}
          setMessage={setMessage}
          submit={submit}
        />
      );

    case "CONVERSATION_HISTORY":
      return <ConversationHistoryPage />;

    default: {
      return (
        <HomePage
          addFiles={addFiles}
          error={error}
          files={files}
          isSubmitting={isSubmitting}
          message={message}
          onStartConversation={() => {}}
          removeFile={removeFile}
          setMessage={setMessage}
          submit={submit}
        />
      );
    }
  }
};
