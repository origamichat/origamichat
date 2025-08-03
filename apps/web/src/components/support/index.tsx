import { Support } from "@cossistant/react";
import React from "react";

function SupportWidget() {
	return (
		<Support
			defaultMessages={[
				"Hi there! I'm Anthony 👋",
				"This is a demo, it's not fully functional yet.",
				"Join the waitlist to get early access!",
			]}
		/>
	);
}

export default SupportWidget;
