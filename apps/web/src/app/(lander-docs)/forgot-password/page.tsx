"use client";

import Link from "next/link";
import { useState } from "react";
import { BaseSubmitButton } from "@/components/ui/base-submit-button";
import { Input } from "@/components/ui/input";
import { forgetPassword } from "@/lib/auth/client";
import { generateSiteMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = generateSiteMetadata({
	title: "Forgot password",
});

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Please enter your email address");
			return;
		}

		setIsLoading(true);
		try {
			const result = await forgetPassword({
				email: email.trim(),
				redirectTo: "/reset-password",
			});

			if (result.error) {
				setError("Failed to send reset email. Please try again.");
			} else {
				setIsSuccess(true);
			}
		} catch (_error) {
			console.error("Forgot password error:", _error);
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="flex min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-md space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="font-f37-stout text-5xl">Check your email</h1>
						<p className="text-primary/60">
							We've sent a password reset link to {email}
						</p>
					</div>
					<div className="rounded-lg bg-primary/5 p-4">
						<p className="text-sm">
							Didn't receive the email? Check your spam folder or{" "}
							<button
								className="underline"
								onClick={() => {
									setIsSuccess(false);
									setEmail("");
								}}
								type="button"
							>
								try again
							</button>
						</p>
					</div>
					<Link
						className="inline-block text-primary/60 text-sm underline"
						href="/login"
					>
						Back to login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="font-f37-stout text-5xl">Forgot password?</h1>
					<p className="text-primary/60">
						No worries, we'll send you reset instructions
					</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Input
							autoComplete="email"
							disabled={isLoading}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							type="email"
							value={email}
							variant="lg"
						/>
						{error && <p className="text-destructive text-sm">{error}</p>}
					</div>

					<BaseSubmitButton
						className="w-full"
						disabled={isLoading || !email.trim()}
						isSubmitting={isLoading}
						size="lg"
						type="submit"
					>
						Send Reset Email
					</BaseSubmitButton>
				</form>

				<div className="text-center">
					<Link className="text-primary/60 text-sm underline" href="/login">
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
}
