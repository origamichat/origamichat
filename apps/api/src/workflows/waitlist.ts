import { serve } from "@upstash/workflow/hono";
import { Hono } from "hono";

const waitlistWorkflow = new Hono();

waitlistWorkflow.post(
	"/join",
	serve(async (context) => {
		await context.run("initial-step", () => {
			console.log("initial step ran");
		});

		await context.run("second-step", () => {
			console.log("second step ran");
		});
	})
);

export default waitlistWorkflow;
