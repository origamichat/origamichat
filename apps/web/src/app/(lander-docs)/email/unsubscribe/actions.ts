"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function unsubscribeAction(email: string) {
	try {
		const response = await fetch(`${API_URL}/trpc/resend.unsubscribe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				json: { email },
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			return { success: false, error: error || "Failed to unsubscribe" };
		}

		return { success: true };
	} catch (error) {
		console.error("Unsubscribe error:", error);
		return {
			success: false,
			error: "Failed to unsubscribe. Please try again later.",
		};
	}
}
