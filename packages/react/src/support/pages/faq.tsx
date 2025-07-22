import type React from "react";
import { Container } from "../components/container";
import { Header } from "../components/header";
import { useSupportNavigation } from "../context/navigation";

export const FAQPage: React.FC = () => {
	const { navigate, goBack, canGoBack } = useSupportNavigation();

	return (
		<>
			<Header>
				<div className="flex w-full items-center gap-2.5">
					{canGoBack && (
						<button
							className="cursor-pointer rounded border-none bg-transparent p-1 px-2 text-base hover:bg-gray-100"
							onClick={goBack}
							type="button"
						>
							←
						</button>
					)}
					<span className="font-medium text-sm">
						Frequently Asked Questions
					</span>
				</div>
			</Header>
			<Container>
				<div className="p-5">
					<div className="flex flex-col gap-5">
						<div>
							<h3 className="mb-2 font-medium text-base text-gray-800">
								How do I start a conversation?
							</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								Click the "Start New Conversation" button on the home page to
								begin chatting with our support team.
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-medium text-base text-gray-800">
								Can I view previous conversations?
							</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								Yes! Navigate to the Conversation History page to see all your
								past conversations.
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-medium text-base text-gray-800">
								How quickly will I get a response?
							</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								Our team typically responds within a few minutes during business
								hours.
							</p>
						</div>
					</div>
					<div className="mt-8">
						<button
							className="cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm text-white transition-colors hover:bg-blue-700"
							onClick={() => navigate({ page: "HOME" })}
							type="button"
						>
							Back to Home
						</button>
					</div>
				</div>
			</Container>
		</>
	);
};
