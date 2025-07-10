import { env } from "@api/env";
import { Resend } from "resend";

/**
 * Lazy-initialized Resend client to avoid instantiation during build
 */
let resendClient: Resend | null = null;

/**
 * Get or create the Resend client instance
 * @returns Resend client or null if API key is not configured
 */
const getResendClient = (): Resend | null => {
  if (!resendClient && env.RESEND_API_KEY) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
};

/**
 * Contact data for creating or updating contacts
 */
export interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}

/**
 * Add a contact to a Resend audience
 * @param audienceId - The Resend audience ID
 * @param contactData - Contact information
 * @returns Promise with success status
 */
export const addContactToAudience = async (
  audienceId: string,
  contactData: ContactData
): Promise<boolean> => {
  const resend = getResendClient();

  if (!(resend && env.RESEND_AUDIENCE_ID)) {
    console.warn("Resend service not configured - skipping contact creation");
    return false;
  }

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

/**
 * Remove a contact from a Resend audience by email
 * @param audienceId - The Resend audience ID
 * @param email - Contact email address
 * @returns Promise with success status
 */
export const removeContactFromAudience = async (
  audienceId: string,
  email: string
): Promise<boolean> => {
  const resend = getResendClient();

  if (!(resend && env.RESEND_AUDIENCE_ID)) {
    console.warn("Resend service not configured - skipping contact removal");
    return false;
  }

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

/**
 * Remove a contact from a Resend audience by contact ID
 * @param audienceId - The Resend audience ID
 * @param contactId - Contact ID
 * @returns Promise with success status
 */
export const removeContactFromAudienceById = async (
  audienceId: string,
  contactId: string
): Promise<boolean> => {
  const resend = getResendClient();

  if (!(resend && env.RESEND_AUDIENCE_ID)) {
    console.warn("Resend service not configured - skipping contact removal");
    return false;
  }

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

/**
 * Update a contact's subscription status in a Resend audience
 * @param audienceId - The Resend audience ID
 * @param email - Contact email address
 * @param unsubscribed - New subscription status
 * @returns Promise with success status
 */
export const updateContactSubscriptionStatus = async (
  audienceId: string,
  email: string,
  unsubscribed: boolean
): Promise<boolean> => {
  const resend = getResendClient();

  if (!(resend && env.RESEND_AUDIENCE_ID)) {
    console.warn("Resend service not configured - skipping contact update");
    return false;
  }

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

/**
 * Add a user to the default Resend audience
 * @param email - User email
 * @param name - User full name (will be split into first/last)
 * @returns Promise with success status
 */
export const addUserToDefaultAudience = async (
  email: string,
  name?: string
): Promise<boolean> => {
  if (!env.RESEND_AUDIENCE_ID) {
    console.warn(
      "RESEND_AUDIENCE_ID not configured - skipping user addition to audience"
    );
    return false;
  }

  const firstName = name?.split(" ")[0] || "";
  const lastName = name?.split(" ").slice(1).join(" ") || "";

  return addContactToAudience(env.RESEND_AUDIENCE_ID, {
    email,
    firstName,
    lastName,
    unsubscribed: false,
  });
};

/**
 * Remove a user from the default Resend audience (convenience function)
 * @param email - User email
 * @returns Promise with success status
 */
export const removeUserFromDefaultAudience = async (
  email: string
): Promise<boolean> => {
  if (!env.RESEND_AUDIENCE_ID) {
    console.warn(
      "RESEND_AUDIENCE_ID not configured - skipping user removal from audience"
    );
    return false;
  }

  return removeContactFromAudience(env.RESEND_AUDIENCE_ID, email);
};
