import { cn } from "@/lib/utils";

export const Page = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"scrollbar-thin scrollbar-thumb-background-500 scrollbar-track-background-500 flex flex-1 flex-col overflow-y-auto rounded border-x border-t p-6 dark:bg-background-100",
				className
			)}
		>
			{children}
		</div>
	);
};

export const CentralBlock = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="flex h-screen w-full flex-col">{children}</section>
	);
};
