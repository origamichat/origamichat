import { addUserToDefaultAudience, sendEmail } from "@api/lib/resend";
import { JoinedWaitlistEmail } from "@cossistant/transactional/emails/joined-waitlist";
import { serve } from "@upstash/workflow/hono";
import { Hono } from "hono";
import type { WaitlistJoinData } from "./types";

const waitlistWorkflow = new Hono();

waitlistWorkflow.post(
	"/join",
	serve<WaitlistJoinData>(async (context) => {
		const { userId, email, name } = context.requestPayload;

		await context.run("post-join-waitlist", async () => {
			console.log(
				`Processing waitlist join for user ${userId} with email ${email}`
			);

			// Add user in resend audience
			// Send email and add user to default audience
			await Promise.all([
				sendEmail({
					to: [email],
					subject: "Welcome to Cossistant",
					content: <JoinedWaitlistEmail email={email} name={name || ""} />,
					includeUnsubscribe: false,
				}),
				addUserToDefaultAudience(email),
			]);
		});
	})
);

export default waitlistWorkflow;
