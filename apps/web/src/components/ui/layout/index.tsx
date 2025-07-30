export const Page = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="scrollbar-thin scrollbar-thumb-background-500 scrollbar-track-background-500 flex flex-1 flex-col overflow-y-auto rounded-[2px] border-x border-t bg-background-200 p-4">
			{children}
		</div>
	);
};

export const CentralBlock = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="flex h-screen w-full flex-col">{children}</section>
	);
};
