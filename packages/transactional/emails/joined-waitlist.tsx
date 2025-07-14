import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Tailwind,
	Text,
} from "@react-email/components";
import { LOGO_URL } from "../constants";

type WaitlistConfirmationEmailProps = {
	name: string;
	email: string;
};

export const JoinedWaitlistEmail = ({
	name,
	email,
}: WaitlistConfirmationEmailProps) => {
	return (
		<Html dir="ltr" lang="en">
			<Tailwind>
				<Head />
				<Body className="py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] px-[40px] py-[40px]">
						<Img
							alt="Cossistant Logo"
							className="mb-[40px] h-auto w-[120px] object-cover"
							src={LOGO_URL}
						/>

						<Text className="mt-0 mb-[40px] font-bold text-[24px]">
							[You&apos;re on the waitlist]
						</Text>

						<Text className="mt-0 mb-[16px] text-[16px]">
							Thank you for joining our waitlist. We're excited to have you on
							board!
						</Text>

						<Text className="mt-0 mb-[16px] text-[16px]">
							We'll notify you as soon as we're ready to welcome you. In the
							meantime, keep an eye on your inbox for updates and exclusive
							content.
						</Text>

						<Text className="mt-0 mb-[32px] text-[16px]">
							Thanks for your patience and support!
						</Text>

						<Text className="mt-0 mb-[32px] text-[16px]">
							Best regards,
							<br />
							Anthony, Founder of Cossistant
						</Text>

						<Text className="mt-0 text-[12px]">
							<a
								className="underline"
								href={`https://cossistant.com/email/unsubscribe?email=${email}`}
							>
								Unsubscribe
							</a>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
