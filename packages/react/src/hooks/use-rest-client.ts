import { CossistantClient } from "@cossistant/core";
import type { CossistantConfig } from "@cossistant/types";
import { useEffect, useMemo, useState } from "react";

export interface UseClientResult {
	client: CossistantClient | null;
	error: Error | null;
}

export function useClient(
	publicKey: string | undefined,
	apiUrl = "https://api.cossistant.com/v1",
	wsUrl = "wss://api.cossistant.com"
): UseClientResult {
	const [error, setError] = useState<Error | null>(null);

	const client = useMemo(() => {
		let keyToUse = publicKey;

		if (!keyToUse) {
			const envKey =
				(typeof window !== "undefined" &&
					window.process?.env?.NEXT_PUBLIC_COSSISSTANT_KEY) ||
				(typeof window !== "undefined" &&
					window.process?.env?.COSSISSTANT_PUBLIC_KEY) ||
				process.env.NEXT_PUBLIC_COSSISSTANT_KEY ||
				process.env.COSSISSTANT_PUBLIC_KEY;

			if (!envKey) {
				setError(
					new Error(
						"Public key is required. Please provide it as a prop or set NEXT_PUBLIC_COSSISSTANT_KEY environment variable."
					)
				);
				return null;
			}
			keyToUse = envKey;
		}

		const config: CossistantConfig = {
			apiUrl,
			wsUrl,
			publicKey: keyToUse,
		};

		try {
			return new CossistantClient(config);
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to initialize Cossistant client")
			);
			return null;
		}
	}, [publicKey, apiUrl, wsUrl]);

	useEffect(() => {
		if (client) {
			setError(null);
		}
	}, [client]);

	return { client, error };
}
