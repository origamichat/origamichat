"use client";

import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { signIn } from "@/lib/auth/client";
import { Button } from "../../../../components/ui/button";
import { GithubIcon, GoogleIcon } from "../login-form";

export function JoinWaitlistButton({ totalEntries }: { totalEntries: number }) {
	const [from] = useQueryState("from", { defaultValue: "" });

	useEffect(() => {
		if (from) {
			// set from ref in local storage
			localStorage.setItem("from", from);
		}
	}, [from]);

	return (
		<div className="flex flex-col items-center justify-center gap-6">
			<Button
				onClick={() =>
					signIn.social({
						provider: "google",
						callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/joined`,
						errorCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/joined/error`,
					})
				}
				size="lg"
			>
				<GoogleIcon className="size-5" />
				Join waitlist with Google
			</Button>
			<Button
				onClick={() =>
					signIn.social({
						provider: "github",
						callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/joined`,
						errorCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/joined/error`,
					})
				}
				size="lg"
			>
				<GithubIcon className="size-5" />
				Join waitlist with Github
			</Button>
			<p className="flex items-center gap-4 text-primary/60 text-sm">
				<span>{totalEntries} people are already on the waitlist</span>
			</p>
		</div>
	);
}
