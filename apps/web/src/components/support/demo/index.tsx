"use client";

import { Support } from "@cossistant/react";
import React from "react";
import { useHasScrolled } from "../../../hooks/use-has-scrolled";

function CossistantLandingSupport() {
	const hasScrolled = useHasScrolled(250);

	const defaultMessages = [
		"Hi there! I'm Anthony 👋",
		"This is a demo, it's not fully functional yet.",
		"Join the waitlist to get early access!",
	];

	return (
		<Support
			defaultMessages={defaultMessages}
			mode={hasScrolled ? "floating" : "responsive"}
		/>
	);
}

export default CossistantLandingSupport;
