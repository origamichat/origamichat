import { useSupportNavigation } from "../store";
import { Button } from "./button";
import Icon from "./icons";

export function NavigationTab() {
	const { current, navigate } = useSupportNavigation();

	return (
		<div className="flex w-full items-center justify-center gap-2">
			<Button
				onClick={() => navigate({ page: "HOME" })}
				variant={current.page === "HOME" ? "tab-selected" : "tab"}
			>
				<Icon
					filledOnHover
					name="home"
					variant={current.page === "HOME" ? "filled" : "default"}
				/>
				Home
			</Button>
			<Button
				onClick={() => navigate({ page: "ARTICLES" })}
				variant={current.page === "ARTICLES" ? "tab-selected" : "tab"}
			>
				<Icon
					filledOnHover
					name="articles"
					variant={current.page === "ARTICLES" ? "filled" : "default"}
				/>
				Articles
			</Button>
		</div>
	);
}
