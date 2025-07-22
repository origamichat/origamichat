import { cn } from "../utils";

export interface ContainerProps {
	className?: string;
	children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
	className,
	children,
}) => {
	return (
		<div
			className={cn(
				"flex flex-1 flex-col gap-2 overflow-y-auto p-5",
				className
			)}
		>
			{children}
		</div>
	);
};
