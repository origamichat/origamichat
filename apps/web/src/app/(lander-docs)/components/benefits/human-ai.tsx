"use client";

import { ConversationEvent } from "@cossistant/react/support/components/conversation-event";
import { MessageGroup } from "@cossistant/react/support/components/message-group";
import {
  type AvailableAIAgent,
  type AvailableHumanAgent,
  type ConversationEvent as ConversationEventType,
  type Message,
  MessageType,
  SenderType,
} from "@cossistant/types";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";

const anthonyAvatar =
  "https://pbs.twimg.com/profile_images/1952043514692280321/v4gOT-jg_400x400.jpg";

type ChatSequenceItem = {
  delay: number;
  duration?: number;
} & (
  | {
      type: "message";
      message: Message;
    }
  | {
      type: "typing";
      senderType: SenderType;
      aiAgentId: string | null;
      userId: string | null;
      visitorId: string | null;
    }
  | { type: "event"; event: ConversationEventType }
);

const chatSequence: ChatSequenceItem[] = [
  {
    type: "message",
    message: {
      id: "1",
      content: "Hi! I see a blank page after onboarding, can you help?",
      type: MessageType.TEXT,
      visitorId: "1",
      conversationId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      userId: null,
      aiAgentId: null,
      visibility: "public",
    },
    delay: 0.5,
  },
  {
    type: "typing",
    senderType: SenderType.AI,
    userId: null,
    visitorId: null,
    aiAgentId: "cossistant",
    delay: 4.0,
    duration: 2.5,
  },
  {
    type: "message",
    message: {
      id: "2",
      conversationId: "1",
      content:
        "Hi! I see an error in the logs. This looks urgent sorry for that, let me connect you with Anthony.",
      type: MessageType.TEXT,
      aiAgentId: "cossistant",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      userId: null,
      visitorId: null,
      visibility: "public",
    },
    delay: 6.5,
  },
  {
    type: "typing",
    senderType: SenderType.AI,
    aiAgentId: "cossistant",
    userId: null,
    visitorId: null,
    delay: 8.5,
    duration: 1.5,
  },
  {
    type: "message",
    message: {
      id: "3",
      content: "Created a ticket to track this. Thanks!",
      type: MessageType.TEXT,
      aiAgentId: "cossistant",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      conversationId: "1",
      userId: null,
      visitorId: null,
      visibility: "public",
    },
    delay: 10.0,
  },
  {
    type: "event",
    event: {
      id: "1",
      conversationId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      type: "participant_joined",
      actorUserId: "anthony",
      actorAiAgentId: null,
      targetUserId: null,
      targetAiAgentId: null,
      organizationId: "1",
      metadata: {},
    },
    delay: 12.0,
  },
  {
    type: "typing",
    senderType: SenderType.TEAM_MEMBER,
    aiAgentId: null,
    userId: "anthony",
    visitorId: null,
    delay: 13.0,
    duration: 3.0,
  },
  {
    type: "message",
    message: {
      id: "4",
      content: "Hi! I'm working on a fix, should be up in a few minutes! 🙏",
      type: MessageType.TEXT,
      aiAgentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      conversationId: "1",
      userId: "anthony",
      visitorId: null,
      visibility: "public",
    },
    delay: 16.0,
  },
  {
    type: "typing",
    senderType: SenderType.TEAM_MEMBER,
    aiAgentId: null,
    userId: "anthony",
    visitorId: null,
    delay: 19.0,
    duration: 3.0,
  },
  {
    type: "message",
    message: {
      id: "5",
      content: "Anything else I can help with?",
      type: MessageType.TEXT,
      aiAgentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      conversationId: "1",
      userId: "anthony",
      visitorId: null,
      visibility: "public",
    },
    delay: 22.0,
  },
];

const availableAIAgents: AvailableAIAgent[] = [];
const availableHumanAgents: AvailableHumanAgent[] = [
  {
    id: "anthony",
    name: "Anthony",
    image: anthonyAvatar,
    lastOnlineAt: new Date().toISOString(),
  },
];

export const HumanAiGraphic = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  // Auto-scroll to bottom when new items are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: ok here
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleItems]);

  useEffect(() => {
    if (isInView) {
      const timeouts: NodeJS.Timeout[] = [];

      const runAnimation = () => {
        setVisibleItems([]);

        chatSequence.forEach((item, index) => {
          const timeout = setTimeout(() => {
            setVisibleItems((prev) => [...prev, index]);

            // Hide typing indicator after duration
            if (item.type === "typing" && item.duration) {
              const hideTimeout = setTimeout(() => {
                setVisibleItems((prev) => prev.filter((i) => i !== index));
              }, item.duration * 1000);
              timeouts.push(hideTimeout);
            }
          }, item.delay * 1000);
          timeouts.push(timeout);
        });

        // Show conversation for 3 seconds after completion, then fade out and restart
        const fadeOutTimeout = setTimeout(() => {
          setVisibleItems([]);
        }, 28_000);
        timeouts.push(fadeOutTimeout);

        // Restart animation
        const restartTimeout = setTimeout(() => {
          runAnimation();
        }, 30_000);
        timeouts.push(restartTimeout);
      };

      runAnimation();

      return () => {
        for (const timeout of timeouts) {
          clearTimeout(timeout);
        }
      };
    }
    setVisibleItems([]);
  }, [isInView]);

  // Helper to get sender ID from a message
  const getSenderId = (message: Message): string => {
    return message.visitorId || message.aiAgentId || message.userId || "";
  };

  // Helper to find the last visible message before the given index
  const findLastVisibleMessage = (
    beforeIndex: number
  ): { index: number; senderId: string } | null => {
    for (let i = beforeIndex - 1; i >= 0; i--) {
      const item = chatSequence[i];
      if (item && item.type === "message" && visibleItems.includes(i)) {
        const message = (item as ChatSequenceItem & { type: "message" })
          .message;
        return { index: i, senderId: getSenderId(message) };
      }
    }
    return null;
  };

  // Helper to count visible messages from a sender in a range
  const countVisibleMessagesFromSender = (
    startIndex: number,
    endIndex: number,
    senderId: string
  ): number => {
    let count = 0;
    for (let i = startIndex; i < endIndex; i++) {
      const item = chatSequence[i];
      if (item && item.type === "message" && visibleItems.includes(i)) {
        const message = (item as ChatSequenceItem & { type: "message" })
          .message;
        if (getSenderId(message) === senderId) {
          count++;
        }
      }
    }
    return count;
  };

  // Helper to check if message was already rendered in a group
  const isMessageAlreadyGrouped = (index: number): boolean => {
    if (index === 0) {
      return false;
    }

    const currentItem = chatSequence[index];
    if (!currentItem || currentItem.type !== "message") {
      return false;
    }

    const currentMessage = (
      currentItem as ChatSequenceItem & { type: "message" }
    ).message;
    const currentSenderId = getSenderId(currentMessage);

    // Find the last visible message before this one
    const lastMessage = findLastVisibleMessage(index);
    if (!lastMessage) {
      return false;
    }

    // If the last message is from a different sender, this starts a new group
    if (lastMessage.senderId !== currentSenderId) {
      return false;
    }

    // Count how many messages from this sender are between the last message and current
    const messageCount = countVisibleMessagesFromSender(
      lastMessage.index,
      index,
      currentSenderId
    );

    // If there's already 1 message from this sender, this would be the 2nd
    return messageCount >= 1;
  };

  // Helper to collect consecutive messages from the same sender
  const collectGroupedMessages = (
    startIndex: number,
    senderId: string
  ): Message[] => {
    const messages: Message[] = [];
    let currentIndex = startIndex;

    while (currentIndex < chatSequence.length && messages.length < 2) {
      const currentItem = chatSequence[currentIndex];

      // Skip if item is not visible
      if (!visibleItems.includes(currentIndex)) {
        currentIndex++;
        continue;
      }

      // If it's a message
      if (currentItem && currentItem.type === "message") {
        const messageItem = currentItem as ChatSequenceItem & {
          type: "message";
        };

        // If it's from a different sender, stop collecting
        if (getSenderId(messageItem.message) !== senderId) {
          break;
        }

        // Add the message to our collection
        messages.push({
          ...messageItem.message,
          id: messageItem.message.id || `message-${currentIndex}`,
        });
      }
      // If it's not a message (typing indicator, event, etc.), skip it

      currentIndex++;
    }

    return messages;
  };

  // Helper to render a message group
  const renderMessageGroup = (messages: Message[], index: number) => (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      key={`message-${index}`}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <MessageGroup
        availableAIAgents={availableAIAgents}
        availableHumanAgents={availableHumanAgents}
        messages={messages}
      />
    </motion.div>
  );

  // Helper to render typing indicator
  const renderTypingIndicator = (
    item: ChatSequenceItem & { type: "typing" },
    index: number
  ) => (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      key={`typing-${index}`}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2">
        {item.senderType === SenderType.AI ? (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <Logo className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="flex flex-col justify-end">
            <div className="size-8 overflow-hidden rounded-full">
              {/** biome-ignore lint/performance/noImgElement: ok */}
              <img
                alt={item.aiAgentId ?? ""}
                className="h-full w-full object-cover"
                src={
                  availableHumanAgents.find((agent) => agent.id === item.userId)
                    ?.image ?? ""
                }
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className="rounded-lg rounded-bl-sm bg-co-background-200 px-3 py-2">
            <div className="flex gap-1">
              <span className="dot-bounce-1 size-1 rounded-full bg-primary" />
              <span className="dot-bounce-2 size-1 rounded-full bg-primary" />
              <span className="dot-bounce-3 size-1 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // biome-ignore lint/suspicious/noExplicitAny: demo we don't care here
  const renderItem = (item: any, index: number) => {
    if (!visibleItems.includes(index)) {
      return null;
    }

    if (item.type === "message") {
      // Skip if this message was already rendered as part of a previous group
      if (isMessageAlreadyGrouped(index)) {
        return null;
      }

      const senderId = getSenderId(item.message);
      const messages = collectGroupedMessages(index, senderId);

      return renderMessageGroup(messages, index);
    }

    if (item.type === "event") {
      return (
        <ConversationEvent
          availableAIAgents={availableAIAgents}
          availableHumanAgents={availableHumanAgents}
          event={item.event}
          key={`event-${index}`}
        />
      );
    }

    if (item.type === "typing") {
      return renderTypingIndicator(item, index);
    }

    return null;
  };

  return (
    <div className="relative h-[300px] w-full overflow-hidden pb-6">
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-8 bg-gradient-to-b from-background to-transparent" />

      <div
        className="flex h-full w-full flex-col gap-4 overflow-hidden p-4 pt-0"
        ref={scrollRef}
      >
        <div className="flex flex-1 flex-col justify-end gap-3" ref={ref}>
          {chatSequence.map((item, index) => renderItem(item, index))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
