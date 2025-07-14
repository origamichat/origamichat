import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import { LOGO_URL } from "../constants";

type ResetPasswordEmailProps = {
	name?: string;
	email: string;
	resetUrl: string;
};

export const ResetPasswordEmail = ({
	name,
	email,
	resetUrl,
}: ResetPasswordEmailProps) => {
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
							Reset your password
						</Text>

						<Text className="mt-0 mb-[16px] text-[16px]">
							Hi {name || "there"},
						</Text>

						<Text className="mt-0 mb-[16px] text-[16px]">
							We received a request to reset your password. Click the button
							below to create a new password:
						</Text>

						<Section className="my-[32px]">
							<Button
								className="inline-block rounded-[6px] bg-black px-[24px] py-[12px] text-center font-medium text-white no-underline"
								href={resetUrl}
							>
								Reset Password
							</Button>
						</Section>

						<Text className="mt-0 mb-[16px] text-[14px] text-gray-600">
							If you didn&apos;t request this, you can safely ignore this email.
							The link will expire in 1 hour.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
