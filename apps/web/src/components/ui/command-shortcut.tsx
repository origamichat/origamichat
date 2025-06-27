import { cn } from "@/lib/utils";

export const CommandShortcut = ({
	className,
	children,
	...props
}: React.HTMLAttributes<Omit<HTMLSpanElement, "children">> & {
	children: string[];
}) => {
	const isMac =
		typeof window !== "undefined" &&
		window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

	const renderShortcut = (_children: string[]) => {
		return (
			<>
				{_children.map((child, index) => {
					return (
						<span key={child}>
							<span>{child === "mod" ? (isMac ? "⌘" : "Ctrl") : child}</span>
							{index < _children.length - 1 && (
								<span className="mx-0.5 text-primary-foreground/80">+</span>
							)}
						</span>
					);
				})}
			</>
		);
	};

	return (
		<span
			className={cn(
				"ml-auto inline-flex h-[24px] min-w-[24px] items-center justify-center rounded-sm border border-primary/10 bg-primary-foreground/20 px-1 text-center font-mono font-semibold text-[10px] text-primary-foreground capitalize tracking-widest",
				className
			)}
			{...props}
		>
			{renderShortcut(children)}
		</span>
	);
};

CommandShortcut.displayName = "CommandShortcut";
