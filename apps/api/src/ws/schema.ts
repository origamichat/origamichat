import { z } from "zod";

export const clientMessageSchema = z.object({
	type: z.literal("ping"),
});
export type ClientMessage = z.infer<typeof clientMessageSchema>;

export const serverMessageSchema = z.object({
	type: z.literal("pong"),
});
export type ServerMessage = z.infer<typeof serverMessageSchema>;
