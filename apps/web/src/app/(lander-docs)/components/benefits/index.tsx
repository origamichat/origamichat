import { cn } from "@/lib/utils";
import { AiAgentsGraphic } from "./ai-agents";
import { CodeFirstGraphic } from "./code-first";
import { ContextGraphic } from "./context";
import { PromptToneGraphic } from "./prompt-tone";
import { SelfLearningGraphic } from "./self-learning";
import { CustomToolsGraphic } from "./tools";

export const HEADLINE =
	"Wake up to zero support tickets, Cossistant keeps your users happy while you sleep.";

const benefits = [
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
		children: CodeFirstGraphic,
		className: "lg:col-span-3",
		title: "React / Next.js ready, fully open",
		description:
			"Drop in a support widget built with open components — customise styling, layout, and behaviour like you would with ShadCN.",
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
			"Empower your agents with founder-built tools — from health checks to billing lookups — so they can solve customer issues without you touching a single ticket.",
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
		<p className="max-w-6xl text-balance px-4 font-f37-stout text-2xl sm:text-3xl md:text-4xl">
			{HEADLINE}
		</p>
		<div className="isolate grid gap-0 lg:grid-cols-6">
			{benefits.map((benefit) => (
				<div
					className={cn(
						"relative flex flex-col gap-2 overflow-hidden border border-primary/10 border-dashed p-4 sm:p-8",
						benefit.className
					)}
					key={benefit.title}
				>
					<div className="relative z-10 h-64 w-full">
						{benefit.children && <benefit.children />}
					</div>
					<h3 className="z-10 mt-4 font-semibold text-xl">{benefit.title}</h3>
					<p className="max-w-sm text-pretty text-muted-foreground">
						{benefit.description}
					</p>
				</div>
			))}
		</div>
	</section>
);
