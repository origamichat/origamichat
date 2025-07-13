import { Suspense } from "react";

export const dynamic = "force-dynamic";

function UnsubscribeContent() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md p-8">
				<div className="rounded-lg bg-white p-8 shadow">
					<h1 className="mb-6 text-center font-bold text-2xl text-gray-900">
						Unsubscribe from Emails
					</h1>
					<p className="mb-6 text-center text-gray-600">
						Click the button below to unsubscribe from our mailing list.
					</p>
					<form action="/email/unsubscribe" method="POST">
						<button
							className="w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							type="submit"
						>
							Unsubscribe
						</button>
					</form>
					<p className="mt-4 text-center text-gray-500 text-sm">
						You can resubscribe at any time by signing up again.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function UnsubscribePage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<div className="text-gray-500">Loading...</div>
				</div>
			}
		>
			<UnsubscribeContent />
		</Suspense>
	);
}
