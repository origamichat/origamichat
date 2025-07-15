import { Support, SupportProvider } from "@cossistant/react";
import React from "react";

function SupportWidget() {
	return (
		<SupportProvider>
			<Support />
		</SupportProvider>
	);
}

export default SupportWidget;
