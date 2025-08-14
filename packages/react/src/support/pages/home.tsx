import { useDefaultMessages } from "@cossistant/react/hooks/use-default-messages";
import type React from "react";
import { useSupport } from "../..";
import { AvatarStack } from "../components/avatar-stack";
import { Button } from "../components/button";
import { Header } from "../components/header";
import Icon from "../components/icons";
import { MultimodalInput } from "../components/multimodal-input";
import { NavigationTab } from "../components/navigation-tab";
import { Watermark } from "../components/watermark";

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
  const { website, availableHumanAgents, visitor, quickOptions } = useSupport();

  // const defaultMessages = useDefaultMessages({ conversationId: "default" });

  return (
    <div className="flex h-full flex-col gap-0 overflow-hidden">
      <Header>
        <NavigationTab />
      </Header>
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
          <h2 className="text-center font-co-sans text-2xl leading-normal">
            Good morning{visitor?.name ? ` ${visitor.name}` : " Anthony"},
            <br />
            How can we help?
          </h2>

          {quickOptions.length > 0 && (
            <div className="mt-6 inline-flex gap-2">
              {quickOptions?.map((option) => (
                <Button key={option} size="default" variant="outline">
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-center justify-center gap-4 px-6 pb-4">
        <Button className="relative w-full" size="large">
          <Icon
            className="-translate-y-1/2 absolute top-1/2 right-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
            name="arrow-right"
            variant="default"
          />
          Ask us a question
        </Button>
        <Watermark />
      </div>
    </div>
  );
};
