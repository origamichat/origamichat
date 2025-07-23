import { Support, SupportConfig } from "@cossistant/react";
import React from "react";

function SupportWidget() {
	return (
		<>
			<Support />

			<SupportConfig
				defaultMessages={[
					"Hi! I'm Anthony the founder of Cossistant 👋",
					"How can I help you?",
				]}
			/>
		</>
	);
}

export default SupportWidget;
