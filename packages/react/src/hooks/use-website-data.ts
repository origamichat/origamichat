import type { CossistantClient } from "@cossistant/core";
import type { PublicWebsiteResponse } from "@cossistant/types";
import { useEffect, useRef, useState } from "react";

export interface UseWebsiteDataResult {
	website: PublicWebsiteResponse | null;
	isLoading: boolean;
	error: Error | null;
}

export function useWebsiteData(
	client: CossistantClient | null
): UseWebsiteDataResult {
	const [website, setWebsite] = useState<PublicWebsiteResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!client || hasFetched.current) {
			return;
		}

		hasFetched.current = true;
		setIsLoading(true);
		setError(null);

		client
			.getWebsite()
			.then((websiteData: PublicWebsiteResponse) => {
				setWebsite(websiteData);
				setIsLoading(false);
			})
			.catch((err: unknown) => {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to fetch website details")
				);
				setIsLoading(false);
			});
	}, [client]);

	return { website, isLoading, error };
}
