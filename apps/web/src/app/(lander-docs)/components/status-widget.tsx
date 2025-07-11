import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusDictionary = {
	operational: {
		label: "Operational",
		color: "bg-green-500",
	},
	degraded_performance: {
		label: "Degraded Performance",
		color: "bg-yellow-500",
	},
	partial_outage: {
		label: "Partial Outage",
		color: "bg-yellow-500",
	},
	major_outage: {
		label: "Major Outage",
		color: "bg-red-500",
	},
	unknown: {
		label: "Unknown",
		color: "bg-gray-500",
	},
	incident: {
		label: "Incident",
		color: "bg-yellow-500",
	},
	under_maintenance: {
		label: "Under Maintenance",
		color: "bg-gray-500",
	},
};

type Status = keyof typeof statusDictionary;

async function getStatus(slug: string): Promise<{ status: Status }> {
	const res = await fetch(`https://api.openstatus.dev/public/status/${slug}`, {
		cache: "no-cache",
	});

	if (res.ok) {
		const data = await res.json();
		return data;
	}

	return { status: "unknown" };
}

interface StatusWidgetProps {
	slug: string;
	href?: string;
}

export async function StatusWidget({ slug, href }: StatusWidgetProps) {
	const { status } = await getStatus(slug);
	const { label, color } = statusDictionary[status];

	return (
		<a
			className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
			href={href || `https://${slug}.openstatus.dev`}
			rel="noreferrer"
			target="_blank"
		>
			{label}
			<span className="relative flex h-2 w-2">
				{status === "operational" ? (
					<span
						className={cn(
							"absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 duration-1000",
							color
						)}
					/>
				) : null}
				<span
					className={cn("relative inline-flex h-2 w-2 rounded-full", color)}
				/>
			</span>
		</a>
	);
}
