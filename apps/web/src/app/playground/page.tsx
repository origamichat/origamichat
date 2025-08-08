"use client";

import { useRealtimeSupport } from "@cossistant/react/hooks/use-realtime-support";
import Support from "@cossistant/react/support";
import { Logo } from "@/components/ui/logo";

export const dynamic = "force-dynamic";

function PlaygroundPropDisplay({
	name,
	value,
}: {
	name: string;
	value: string;
}) {
	return (
		<div className="flex items-center justify-between gap-4">
			<h2 className="font-medium text-sm">{name}</h2>
			<div className="h-[1px] flex-1 bg-primary/10" />
			<p className="font-mono text-sm uppercase">{value}</p>
		</div>
	);
}

export default function Playground() {
	const { isConnected } = useRealtimeSupport();

	return (
		<>
			<div className="flex min-h-screen bg-background-200 p-20">
				<div className="w-1/3 border border-primary/10 border-dashed p-6">
					<h1 className="flex items-center gap-2 font-f37-stout text-xl">
						<Logo />
						Dev playground
					</h1>
					<div className="mt-6 flex flex-col gap-2">
						<PlaygroundPropDisplay
							name="Websocket healthy"
							value={isConnected.toString()}
						/>
					</div>
				</div>
				<Support />
			</div>
		</>
	);
}
