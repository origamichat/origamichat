"use client";
import { Bubble, Chat, Provider, Window } from "@cossistant/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [value, setValue] = React.useState("");

  const handleSubmit = () => {
    // TODO: integrate with backend
    setValue("");
  };

  return (
    <Provider.CossistantProvider>
      <Bubble.Button
        className={cn(
          "fixed right-4 bottom-4 z-50",
          "rounded-full bg-primary px-4 py-2 text-primary-foreground"
        )}
      >
        Chat
      </Bubble.Button>
      <Window.Window
        className={cn(
          "fixed right-4 bottom-20 z-50 flex w-80 flex-col",
          "rounded border bg-background shadow-lg"
        )}
        footer={null}
        header={<div className="p-3 font-medium">Chat</div>}
      >
        <div className="flex-1 overflow-y-auto p-3">
          {/* messages go here */}
        </div>
        <div className="flex items-end gap-2 border-t p-3">
          <Chat.Input
            className="flex-1 resize-none rounded border px-2 py-1"
            onChange={setValue}
            onSubmit={handleSubmit}
            value={value}
          />
          <Chat.SendButton
            className="rounded bg-primary px-3 py-1 text-primary-foreground"
            onClick={handleSubmit}
          >
            Send
          </Chat.SendButton>
        </div>
      </Window.Window>
    </Provider.CossistantProvider>
  );
}
