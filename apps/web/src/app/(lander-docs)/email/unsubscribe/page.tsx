"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { unsubscribeAction } from "./actions";

export default function UnsubscribePage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const emailFromUrl = searchParams.get("email");
	const [email, setEmail] = useState(emailFromUrl || "");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			setError("Email is required");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await unsubscribeAction(email);
			if (result.success) {
				setIsSuccess(true);
			} else {
				setError(result.error || "Failed to unsubscribe");
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		router.back();
	};

	if (isSuccess) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="w-full max-w-md p-8">
					<div className="rounded-lg border-2 border-gray-200 bg-white p-8 shadow-sm">
						<div className="mb-6 flex justify-center">
							<Logo className="h-12 w-12 text-primary" />
						</div>
						<h1 className="mb-4 text-center font-bold text-2xl text-gray-900">
							Successfully Unsubscribed
						</h1>
						<p className="text-center text-gray-600">
							You have been successfully unsubscribed from our mailing list.
						</p>
						<p className="mt-4 text-center text-gray-500 text-sm">
							We're sorry to see you go. If you change your mind, you can always
							sign up again.
						</p>
						<button
							className="mt-6 w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							onClick={handleBack}
							type="button"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md p-8">
				<div className="rounded-lg border-2 border-gray-200 bg-white p-8 shadow-sm">
					<div className="mb-6 flex justify-center">
						<Logo className="h-12 w-12 text-primary" />
					</div>
					<h1 className="mb-6 text-center font-bold text-2xl text-gray-900">
						Unsubscribe from Emails
					</h1>
					{emailFromUrl ? (
						<p className="mb-6 text-center text-gray-600">
							Are you sure you want to unsubscribe{" "}
							<strong>{emailFromUrl}</strong> from our mailing list?
						</p>
					) : (
						<p className="mb-6 text-center text-gray-600">
							Enter your email address to unsubscribe from our mailing list.
						</p>
					)}
					<form onSubmit={handleSubmit}>
						{!emailFromUrl && (
							<div className="mb-4">
								<label
									className="mb-2 block font-medium text-gray-700 text-sm"
									htmlFor="email"
								>
									Email Address
								</label>
								<input
									className="w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
									id="email"
									name="email"
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									required
									type="email"
									value={email}
								/>
							</div>
						)}
						{error && (
							<div className="mb-4 rounded-md bg-red-50 p-3 text-red-800 text-sm">
								{error}
							</div>
						)}
						<button
							className="w-full rounded-md border-2 border-red-600 bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
							disabled={isLoading}
							type="submit"
						>
							{isLoading ? "Processing..." : "Unsubscribe"}
						</button>
					</form>
					<button
						className="mt-4 w-full rounded-md border-2 border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						onClick={handleBack}
						type="button"
					>
						Cancel
					</button>
					<p className="mt-4 text-center text-gray-500 text-sm">
						You can resubscribe at any time by signing up again.
					</p>
				</div>
			</div>
		</div>
	);
}
