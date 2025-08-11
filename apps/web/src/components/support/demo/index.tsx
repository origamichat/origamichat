"use client";

import { Support } from "@cossistant/react";
import React from "react";
import { useHasScrolled } from "../../../hooks/use-has-scrolled";

function CossistantLandingSupport() {
	const hasScrolled = useHasScrolled(250);

	return (
		<>
			<Support mode={hasScrolled ? "floating" : "responsive"} />
		</>
	);
}

export default CossistantLandingSupport;
