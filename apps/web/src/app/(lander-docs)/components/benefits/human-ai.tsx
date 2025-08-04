"use client";

import { ConversationEvent } from "@cossistant/react/support/components/conversation-event";
import { MessageGroup } from "@cossistant/react/support/components/message-group";
import { SenderType } from "@cossistant/types";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";

const yinyangAvatar = "https://cdn.cossistant.com/yin-yang.png";
const anthonyAvatar =
	"https://pbs.twimg.com/profile_images/1952043514692280321/v4gOT-jg_400x400.jpg";

const chatSequence = [
	{
		type: "message",
		message: {
			id: "1",
			content: "Hi! I see a blank page after onboarding, can you help?",
			sender: SenderType.VISITOR,
			timestamp: new Date().toISOString(),
		},
		senderName: "Yin Yang",
		senderImage: yinyangAvatar,
		delay: 0.5,
	},
	{
		type: "typing",
		sender: SenderType.AI,
		delay: 4.0,
		duration: 2.5,
	},
	{
		type: "message",
		message: {
			id: "2",
			content:
				"Hi! I see an error in the logs. This looks urgent sorry for that, let me connect you with Anthony.",
			sender: SenderType.AI,
			timestamp: new Date().toISOString(),
		},
		delay: 6.5,
	},
	{
		type: "typing",
		sender: SenderType.AI,
		delay: 8.5,
		duration: 1.5,
	},
	{
		type: "message",
		message: {
			id: "3",
			content: "Created a ticket to track this. Thanks!",
			sender: SenderType.AI,
			timestamp: new Date().toISOString(),
		},
		delay: 10.0,
	},
	{
		type: "event",
		event: "Anthony joined the conversation",
		senderName: "Anthony",
		senderImage: anthonyAvatar,
		senderType: SenderType.TEAM_MEMBER,
		delay: 12.0,
	},
	{
		type: "typing",
		sender: SenderType.TEAM_MEMBER,
		senderName: "Anthony",
		senderImage: anthonyAvatar,
		delay: 13.0,
		duration: 3.0,
	},
	{
		type: "message",
		message: {
			id: "4",
			content: "Hi! I'm working on a fix, should be up in a few minutes! 🙏",
			sender: SenderType.TEAM_MEMBER,
			timestamp: new Date().toISOString(),
		},
		senderName: "Anthony",
		senderImage: anthonyAvatar,
		delay: 16.0,
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
				}, 23_000);
				timeouts.push(fadeOutTimeout);

				// Restart animation
				const restartTimeout = setTimeout(() => {
					runAnimation();
				}, 24_000);
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

	// biome-ignore lint/suspicious/noExplicitAny: demo we don't care here
	const renderItem = (item: any, index: number) => {
		if (!visibleItems.includes(index)) {
			return null;
		}

		if (item.type === "message") {
			const messages = [
				{
					...item.message,
					id: item.message.id || `message-${index}`,
				},
			];

			return (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 10 }}
					key={`message-${index}`}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<MessageGroup
						messages={messages}
						senderImage={item.senderImage}
						senderName={item.senderName}
					/>
				</motion.div>
			);
		}

		if (item.type === "event") {
			return (
				<ConversationEvent
					event={item.event}
					key={`event-${index}`}
					senderImage={item.senderImage}
					senderName={item.senderName}
					senderType={item.senderType}
					timestamp={new Date()}
				/>
			);
		}

		if (item.type === "typing") {
			return (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 10 }}
					key={`typing-${index}`}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<div className="flex items-center gap-2">
						{item.sender === SenderType.AI ? (
							<div className="flex size-8 items-center justify-center rounded bg-primary/10">
								<Logo className="h-5 w-5 text-primary" />
							</div>
						) : (
							<div className="flex flex-col justify-end">
								<div className="size-8 overflow-hidden rounded">
									{/** biome-ignore lint/performance/noImgElement: ok */}
									<img
										alt={item.senderName}
										className="h-full w-full object-cover"
										src={item.senderImage}
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
