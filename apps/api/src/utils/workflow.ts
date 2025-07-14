import { env } from "@api/env";
import type { WorkflowDataMap } from "@api/workflows/types";
import { Client } from "@upstash/workflow";

const client = new Client({
	token: env.QSTASH_TOKEN,
});

type TriggerWorkflowParams<
	T extends keyof WorkflowDataMap = keyof WorkflowDataMap,
> = {
	path: T;
	data: WorkflowDataMap[T];
};

export const triggerWorkflow = async <T extends keyof WorkflowDataMap>({
	path,
	data,
}: TriggerWorkflowParams<T>) => {
	await client.trigger({
		url: `${env.BETTER_AUTH_URL}/workflow/${path}`,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};
