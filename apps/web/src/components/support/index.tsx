import { Support, SupportConfig } from "@cossistant/react";
import React from "react";

function SupportWidget() {
	return (
		<>
			<Support />

			<SupportConfig
				quickOptions={[
					"What is Cossistant?",
					"How to get started?",
					"Pricing options",
				]}
			/>
		</>
	);
}

export default SupportWidget;
