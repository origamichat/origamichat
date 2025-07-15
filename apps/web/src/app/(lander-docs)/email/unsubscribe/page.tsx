"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BaseSubmitButton } from "@/components/ui/base-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useTRPC } from "@/lib/trpc/client";

export default function UnsubscribePage() {
	const searchParams = useSearchParams();
	const emailFromUrl = searchParams.get("email");
	const [email, setEmail] = useState(emailFromUrl || "");
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const trpc = useTRPC();

	const { mutate: unsubscribe, isPending } = useMutation(
		trpc.resend.unsubscribe.mutationOptions({
			onSuccess: () => {
				setIsSuccess(true);
				setError(null);
			},
			onError: (err) => {
				setError(err.message || "Failed to unsubscribe");
			},
		})
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			setError("Email is required");
			return;
		}

		setError(null);
		unsubscribe({ email });
	};

	if (isSuccess) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="w-full max-w-md p-8">
					<div className="p-8">
						<div className="mb-6 flex justify-center">
							<Logo className="h-12 w-12 text-primary" />
						</div>
						<h1 className="mb-4 text-center font-bold font-f37-stout text-2xl text-primary">
							Successfully Unsubscribed
						</h1>

						<p className="mt-4 mb-6 text-center text-primary/60 text-sm">
							We're sorry to see you go. If you change your mind, you can always
							sign up again.
						</p>
						<Link href="/">
							<Button className="w-full" variant="outline">
								Go Back
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center ">
			<div className="w-full max-w-md p-8">
				<div className="p-8">
					<div className="mb-6 flex justify-center">
						<Logo className="h-12 w-12 text-primary" />
					</div>
					<h1 className="mb-6 text-center font-bold font-f37-stout text-2xl text-primary">
						Unsubscribe from Emails
					</h1>
					{emailFromUrl ? (
						<p className="mb-6 text-center text-primary/60">
							Are you sure you want to unsubscribe{" "}
							<strong>{emailFromUrl}</strong> from our mailing list?
						</p>
					) : (
						<p className="mb-6 text-center text-primary/60">
							Enter your email address to unsubscribe from our mailing list.
						</p>
					)}
					<form onSubmit={handleSubmit}>
						{!emailFromUrl && (
							<div className="mb-4">
								<Label htmlFor="email">Email Address</Label>
								<Input
									className="w-full"
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
						<BaseSubmitButton
							className="mb-2 w-full"
							disabled={isPending}
							isSubmitting={isPending}
							variant="destructive"
						>
							Unsubscribe
						</BaseSubmitButton>
					</form>
					<Link href="/">
						<Button className="w-full" type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<p className="mt-4 text-center text-primary/60 text-sm">
						You can resubscribe at any time by signing up again.
					</p>
				</div>
			</div>
		</div>
	);
}
