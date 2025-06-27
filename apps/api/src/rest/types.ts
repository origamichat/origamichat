import type {
	ApiKeySelect,
	Database,
	OrganizationSelect,
	WebsiteSelect,
} from "@cossistant/database";

export type RestContext = {
	Variables: {
		db: Database;
		apiKey: ApiKeySelect;
		organization: OrganizationSelect;
		website: WebsiteSelect;
	};
};
