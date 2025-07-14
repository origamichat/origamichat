import { env } from "@api/env";
import { Client } from "@upstash/workflow";

const client = new Client({
	token: env.QSTASH_TOKEN,
});

export const WORKFLOW = {
	WAITLIST_JOIN: "waitlist/join",
} as const;

type DataMap = {
	[WORKFLOW.WAITLIST_JOIN]: {
		email: string;
		name: string;
		referralCode: string;
	};
};

type TriggerWorkflowParams<T = keyof typeof WORKFLOW> = {
	path: T;
	data: DataMap[T];
};

export const triggerWorkflow = async ({
	path,
	data,
}: TriggerWorkflowParams) => {
	await client.trigger({
		url: `${env.BETTER_AUTH_URL}/workflow/${path}`,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
