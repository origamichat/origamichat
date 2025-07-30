type Props = {
	children: React.ReactNode;
};

export function SidebarContainer({ children }: Props) {
	return <div className="flex w-full flex-col">{children}</div>;
}
