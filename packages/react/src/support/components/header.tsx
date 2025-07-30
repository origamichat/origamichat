import { cn } from "../utils";

export interface HeaderProps {
	className?: string;
	title?: string;
	children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
	className,
	title = "Support",
	children,
}) => {
	return (
		<div className={cn("flex min-h-14 items-center px-5", className)}>
			{children || (
				<p className="font-medium text-co-foreground text-sm">{title}</p>
			)}
		</div>
	);
};
