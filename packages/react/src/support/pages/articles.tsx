import type React from "react";
import { Container } from "../components/container";
import { Header } from "../components/header";
import { NavigationTab } from "../components/navigation-tab";

export const ArticlesPage: React.FC = () => {
	return (
		<>
			<Header>
				<NavigationTab />
			</Header>
			<Container>
				<div className="p-2">
					<div className="flex flex-col gap-5">
						<div>
							<h3 className="mb-2 font-medium text-base text-primary">
								How do I start a conversation?
							</h3>
							<p className="text-primary/60 text-sm leading-relaxed">
								Click the "Start New Conversation" button on the home page to
								begin chatting with our support team.
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-medium text-base text-primary">
								Can I view previous conversations?
							</h3>
							<p className="text-primary/60 text-sm leading-relaxed">
								Yes! Navigate to the Conversation History page to see all your
								past conversations.
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-medium text-base text-primary">
								How quickly will I get a response?
							</h3>
							<p className="text-primary/60 text-sm leading-relaxed">
								Our team typically responds within a few minutes during business
								hours.
							</p>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};
