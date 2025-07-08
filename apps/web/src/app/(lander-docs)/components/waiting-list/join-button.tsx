"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
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

export function JoinWaitlistButton({ totalEntries }: { totalEntries: number }) {
	const [from] = useQueryState("from", { defaultValue: "" });
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

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
			const signUpResult = await signUp.email({
				email: email.trim(),
				password: randomPassword,
				name,
				callbackURL: `${baseURL}/joined`,
			});

			if (signUpResult.error) {
				console.error("Signup error:", signUpResult.error);
				alert("An error occurred during signup. Please try again.");
			}
			// Note: autoSignIn is enabled in better-auth config, so user will be automatically logged in
		} catch (error) {
			console.error("Email signup error:", error);
			alert("An error occurred during signup. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center gap-6">
			{/* Email Signup Form - Primary Option */}
			<div className="w-full max-w-md space-y-4">
				<div className="text-center">
					<h3 className="font-f37-stout text-lg">Join waitlist</h3>
					<p className="text-primary/60 text-sm">
						Enter your email to get started
					</p>
				</div>

				<form className="space-y-3" onSubmit={handleEmailSignup}>
					<Input
						disabled={isLoading}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
						type="email"
						value={email}
						variant="lg"
					/>
					<Button
						className="w-full"
						disabled={isLoading || !email.trim()}
						size="lg"
						type="submit"
					>
						{isLoading ? "Joining..." : "Join Waitlist"}
					</Button>
				</form>
			</div>

			{/* Separator */}
			<div className="flex w-full max-w-sm items-center gap-4">
				<Separator className="flex-1" />
				<span className="text-primary/50 text-xs">OR CONTINUE WITH</span>
				<Separator className="flex-1" />
			</div>

			{/* Social Login Options */}
			<div className="flex w-full max-w-sm flex-col gap-3">
				<Button
					className="w-full"
					onClick={() =>
						signIn.social({
							provider: "google",
							callbackURL: `${baseURL}/joined`,
							errorCallbackURL: `${baseURL}/joined/error`,
						})
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
						signIn.social({
							provider: "github",
							callbackURL: `${baseURL}/joined`,
							errorCallbackURL: `${baseURL}/joined/error`,
						})
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
		</div>
	);
}
