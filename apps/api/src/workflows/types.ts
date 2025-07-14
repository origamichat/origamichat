export const WORKFLOW = {
	WAITLIST_JOIN: "waitlist/join",
	WAITLIST_LEAVE: "waitlist/leave",
} as const;

// Export data types for use in workflow handlers
export type WaitlistJoinData = {
	userId: string;
	email: string;
	name: string;
};

export type WorkflowDataMap = {
	[WORKFLOW.WAITLIST_JOIN]: WaitlistJoinData;
};
