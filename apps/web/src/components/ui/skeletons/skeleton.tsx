import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("animate-pulse rounded bg-accent", className)}
			data-slot="skeleton"
			{...props}
		/>
	);
}

export { Skeleton };
