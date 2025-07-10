import { env } from "@api/env";
import { Resend } from "resend";

export interface ContactData {
	email: string;
	firstName?: string;
	lastName?: string;
	unsubscribed?: boolean;
}

export const addContactToAudience = async (
	audienceId: string,
	contactData: ContactData
): Promise<boolean> => {
	try {
		await resend.contacts.create({
			email: contactData.email,
			firstName: contactData.firstName,
			lastName: contactData.lastName,
			unsubscribed: contactData.unsubscribed ?? false,
			audienceId,
		});

		console.log(
			`Successfully added contact ${contactData.email} to Resend audience ${audienceId}`
		);
		return true;
	} catch (error) {
		console.error("Failed to add contact to Resend audience:", error);
		// Don't throw error to avoid blocking user operations
		return false;
	}
};

export const removeContactFromAudience = async (
	audienceId: string,
	email: string
): Promise<boolean> => {
	try {
		await resend.contacts.remove({
			email,
			audienceId,
		});

		console.log(
			`Successfully removed contact ${email} from Resend audience ${audienceId}`
		);
		return true;
	} catch (error) {
		console.error("Failed to remove contact from Resend audience:", error);
		// Don't throw error to avoid blocking user operations
		return false;
	}
};

export const removeContactFromAudienceById = async (
	audienceId: string,
	contactId: string
): Promise<boolean> => {
	try {
		await resend.contacts.remove({
			id: contactId,
			audienceId,
		});

		console.log(
			`Successfully removed contact ${contactId} from Resend audience ${audienceId}`
		);
		return true;
	} catch (error) {
		console.error("Failed to remove contact from Resend audience:", error);
		// Don't throw error to avoid blocking user operations
		return false;
	}
};

export const updateContactSubscriptionStatus = async (
	audienceId: string,
	email: string,
	unsubscribed: boolean
): Promise<boolean> => {
	try {
		await resend.contacts.update({
			email,
			audienceId,
			unsubscribed,
		});

		console.log(
			`Successfully updated contact ${email} subscription status to ${unsubscribed ? "unsubscribed" : "subscribed"}`
		);
		return true;
	} catch (error) {
		console.error("Failed to update contact subscription status:", error);
		// Don't throw error to avoid blocking user operations
		return false;
	}
};

export const addUserToDefaultAudience = async (
	email: string,
	name?: string
): Promise<boolean> => {
	const firstName = name?.split(" ")[0] || "";
	const lastName = name?.split(" ").slice(1).join(" ") || "";

	return addContactToAudience(env.RESEND_AUDIENCE_ID, {
		email,
		firstName,
		lastName,
		unsubscribed: false,
	});
};

export const removeUserFromDefaultAudience = async (
	email: string
): Promise<boolean> => {
	return removeContactFromAudience(env.RESEND_AUDIENCE_ID, email);
};

const resend = new Resend(env.RESEND_API_KEY);

export default resend;
