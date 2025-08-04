import { cn } from "@/lib/utils";
import { AiAgentsGraphic } from "./ai-agents";
import { ContextGraphic } from "./context";
import { HumanAiGraphic } from "./human-ai";
import { PromptToneGraphic } from "./prompt-tone";
import { SelfLearningGraphic } from "./self-learning";
import { CustomToolsGraphic } from "./tools";

export const HEADLINE =
	"Wake up to zero support tickets, Cossistant keeps your users happy while you sleep.";

const benefits = [
	{
		children: HumanAiGraphic,
		className: "lg:col-span-3",
		title: "Human + AI support",
		description:
			"AI agents don’t just spit answers, they join the conversation like a teammate, talking naturally and handing off smoothly when a human needs to step in.",
	},
	{
		children: AiAgentsGraphic,
		className: "lg:col-span-3",
		title: "24/7 autonomous AI agents",
		description:
			"Agents handle questions around the clock across time zones, cutting response times to seconds without needing extra staff.",
	},
	{
		children: ContextGraphic,
		className: "lg:col-span-3",
		title: "Context-aware replies",
		description:
			"Agents read app logs, errors, user actions, past conversations and knowledge base to deliver precise answers—no generic chatbot fluff.",
	},
	{
		children: SelfLearningGraphic,
		className: "lg:col-span-3",
		title: "Self-learning knowledge base",
		description:
			"Cossistant crawls your docs, resources and conversations to auto-build FAQs, improving agents answers as your product and support evolves.",
	},
	{
		children: CustomToolsGraphic,
		className: "lg:col-span-3",
		title: "Default & Custom tools",
		description:
			"Out-of-the-box support for tools like Linear to log tickets, Stripe to check subscriptions, and Cal.com to book calls, plus the freedom to wire up your own APIs for truly custom actions.",
	},
	{
		children: PromptToneGraphic,
		className: "lg:col-span-3",
		title: "Control prompt & tone",
		description:
			"Set the model, prompt, and personality of your agent. Make it formal, funny, or straight to the point — you’re in charge.",
	},
] as const;

export const Benefits = () => (
	<section className="mt-20 grid gap-6 md:gap-12">
		<p className="w-full max-w-6xl text-pretty px-4 font-f37-stout text-4xl sm:text-3xl md:text-balance md:text-4xl">
			{HEADLINE}
		</p>
		<div className="isolate grid gap-0 border-primary/10 border-y border-dashed lg:grid-cols-6">
			{benefits.map((benefit, index) => (
				<div
					className={cn(
						"relative flex flex-col gap-2 overflow-hidden border-primary/10 border-dashed p-4 pt-20 sm:p-8 sm:pt-10",
						benefit.className,
						// Add border-right for first column items (index 0, 2, 4)
						index % 2 === 0 && "border-r",
						// Add border-bottom for all items except last row (index 0, 1, 2, 3)
						index < 4 && "border-b"
					)}
					key={benefit.title}
				>
					<div className="relative z-10 h-64 w-full">
						{benefit.children && <benefit.children />}
					</div>
					<h3 className="z-10 mt-4 font-semibold text-xl">{benefit.title}</h3>
					<p className="w-full max-w-lg text-balance text-muted-foreground">
						{benefit.description}
					</p>
				</div>
			))}
		</div>
	</section>
);
