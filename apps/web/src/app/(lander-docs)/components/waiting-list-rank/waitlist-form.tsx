"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BaseSubmitButton } from "@/components/ui/base-submit-button";
import { signIn, signUp } from "@/lib/auth/client";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { GithubIcon, GoogleIcon } from "../login-form";

function generateRandomPassword(length = 16): string {
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
}

export function WaitlistForm({ totalEntries }: { totalEntries: number }) {
	const [from] = useQueryState("from", { defaultValue: "" });
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

	useEffect(() => {
		if (from) {
			// set from ref in local storage
			localStorage.setItem("from", from);
		}
	}, [from]);

	const handleEmailSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			return;
		}

		setIsLoading(true);
		try {
			// Generate a random password
			const randomPassword = generateRandomPassword();

			// Extract name from email (before @)
			const name = email.split("@")[0] as string;

			// Sign up with email and random password
			const signUpResult = await signUp.email(
				{
					email: email.trim(),
					password: randomPassword,
					name,
					callbackURL: `${baseURL}/waitlist/joined`,
				},
				{
					onSuccess: () => {
						// Redirect to waitlist joined page
						router.push("/waitlist/joined");
					},
					onError: (ctx) => {
						// Handle specific error types
						if (ctx.error.code === "USER_ALREADY_EXISTS") {
							toast("You're already on the waitlist!");
						} else {
							console.error("Signup error:", ctx.error);
							toast("An error occurred during signup. Please try again.");
						}
					},
				}
			);

			if (signUpResult.error) {
				// Handle specific error types
				if (signUpResult.error.code === "USER_ALREADY_EXISTS") {
					toast("You're already on the waitlist!");
				} else {
					console.error("Signup error:", signUpResult.error);
					toast("An error occurred during signup. Please try again.");
				}
			}
		} catch (error) {
			console.error("Email signup error:", error);
			toast("An error occurred during signup. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center gap-6">
			{/* Email Signup Form - Primary Option */}
			<div className="w-full max-w-md space-y-4">
				<div className="flex flex-col gap-2 text-center">
					<h1 className="font-f37-stout text-5xl">Join waitlist</h1>
					<p className="text-md text-primary/60">
						Enter your email to get started
					</p>
				</div>

				<form className="mt-10 space-y-3" onSubmit={handleEmailSignup}>
					<Input
						disabled={isLoading}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
						type="email"
						value={email}
						variant="lg"
					/>
					<BaseSubmitButton
						className="w-full"
						disabled={isLoading || !email.trim()}
						isSubmitting={isLoading}
						size="lg"
					>
						Join Waitlist
					</BaseSubmitButton>
				</form>
			</div>

			{/* Separator */}
			<div className="flex w-full max-w-md items-center gap-4">
				<Separator className="flex-1" />
				<span className="text-primary/50 text-xs">OR CONTINUE WITH</span>
				<Separator className="flex-1" />
			</div>

			{/* Social Login Options */}
			<div className="flex w-full max-w-md flex-col gap-3">
				<Button
					className="w-full"
					onClick={() =>
						signIn.social(
							{
								provider: "google",
								callbackURL: `${baseURL}/waitlist/joined`,
								errorCallbackURL: `${baseURL}/waitlist/joined/error`,
							},
							{
								onSuccess: () => {
									// Redirect to waitlist joined page
									router.push("/waitlist/joined");
								},
								onError: (ctx) => {
									// Redirect to error page
									router.push("/waitlist/joined/error");
								},
							}
						)
					}
					size="lg"
					variant="outline"
				>
					<GoogleIcon className="size-4" />
					Continue with Google
				</Button>
				<Button
					className="w-full"
					onClick={() =>
						signIn.social(
							{
								provider: "github",
								callbackURL: `${baseURL}/waitlist/joined`,
								errorCallbackURL: `${baseURL}/waitlist/joined/error`,
							},
							{
								onSuccess: () => {
									// Redirect to waitlist joined page
									router.push("/waitlist/joined");
								},
								onError: (ctx) => {
									// Redirect to error page
									router.push("/waitlist/joined/error");
								},
							}
						)
					}
					size="lg"
					variant="outline"
				>
					<GithubIcon className="size-4" />
					Continue with GitHub
				</Button>
			</div>

			<p className="mt-4 flex items-center gap-4 text-primary/60 text-sm">
				<span>{totalEntries} people are already on the waitlist</span>
			</p>

			<p className="text-primary/60 text-sm">
				Already on the waitlist?{" "}
				<a
					className="text-primary underline hover:text-primary/80"
					href="/waitlist/joined"
				>
					Log in
				</a>
			</p>
		</div>
	);
}
