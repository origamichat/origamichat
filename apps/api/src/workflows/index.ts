import { Hono } from "hono";

// Workflows
import waitlistWorkflow from "./waitlist";

const workflowsRouters = new Hono();

// Include all workflows below
workflowsRouters.route("/waitlist", waitlistWorkflow);

export { workflowsRouters };
