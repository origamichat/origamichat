import { type NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const email = searchParams.get("email");

	if (!email) {
		return new NextResponse("Email parameter is required", { status: 400 });
	}

	// Render the unsubscribe page with the email pre-filled
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>Unsubscribe</title>
			<script src="https://cdn.tailwindcss.com"></script>
		</head>
		<body>
			<div class="flex min-h-screen items-center justify-center bg-gray-50">
				<div class="w-full max-w-md p-8">
					<div class="rounded-lg bg-white p-8 shadow">
						<h1 class="mb-6 text-center font-bold text-2xl text-gray-900">
							Unsubscribe from Emails
						</h1>
						<p class="mb-6 text-center text-gray-600">
							Are you sure you want to unsubscribe <strong>${email}</strong> from our mailing list?
						</p>
						<form method="POST" action="/email/unsubscribe">
							<input type="hidden" name="email" value="${email}" />
							<button
								type="submit"
								class="w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							>
								Unsubscribe
							</button>
						</form>
						<p class="mt-4 text-center text-sm text-gray-500">
							You can resubscribe at any time by signing up again.
						</p>
					</div>
				</div>
			</div>
		</body>
		</html>
	`;

	return new NextResponse(html, {
		headers: { "Content-Type": "text/html" },
	});
}

export async function POST(request: NextRequest) {
	try {
		// Check if this is a one-click unsubscribe request (from email headers)
		const contentType = request.headers.get("content-type");
		const isOneClick = contentType?.includes(
			"application/x-www-form-urlencoded"
		);

		let email: string | null = null;

		if (isOneClick) {
			// Handle one-click unsubscribe from email headers
			const body = await request.text();
			const params = new URLSearchParams(body);
			email =
				params.get("List-Unsubscribe") ||
				request.nextUrl.searchParams.get("email");
		} else {
			// Handle form submission
			const formData = await request.formData();
			email = formData.get("email") as string;
		}

		if (!email) {
			return new NextResponse("Email is required", { status: 400 });
		}

		// Call the API to update the contact's subscription status
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
			throw new Error("Failed to unsubscribe");
		}

		// For one-click unsubscribe, return blank page with 200 status
		if (isOneClick) {
			return new NextResponse("", { status: 200 });
		}

		// Return success page for regular form submission
		const successHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Unsubscribed</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body>
				<div class="flex min-h-screen items-center justify-center bg-gray-50">
					<div class="w-full max-w-md p-8">
						<div class="rounded-lg bg-white p-8 shadow">
							<div class="mb-4 flex justify-center">
								<svg class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h1 class="mb-4 text-center font-bold text-2xl text-gray-900">
								Successfully Unsubscribed
							</h1>
							<p class="text-center text-gray-600">
								You have been successfully unsubscribed from our mailing list.
							</p>
							<p class="mt-4 text-center text-sm text-gray-500">
								We're sorry to see you go. If you change your mind, you can always sign up again.
							</p>
						</div>
					</div>
				</div>
			</body>
			</html>
		`;

		return new NextResponse(successHtml, {
			status: 200,
			headers: { "Content-Type": "text/html" },
		});
	} catch (error) {
		console.error("Unsubscribe error:", error);

		// Return error page
		const errorHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Error</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body>
				<div class="flex min-h-screen items-center justify-center bg-gray-50">
					<div class="w-full max-w-md p-8">
						<div class="rounded-lg bg-white p-8 shadow">
							<div class="mb-4 flex justify-center">
								<svg class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h1 class="mb-4 text-center font-bold text-2xl text-gray-900">
								Something went wrong
							</h1>
							<p class="text-center text-gray-600">
								We couldn't process your unsubscribe request. Please try again later.
							</p>
						</div>
					</div>
				</div>
			</body>
			</html>
		`;

		return new NextResponse(errorHtml, {
			status: 500,
			headers: { "Content-Type": "text/html" },
		});
	}
}
