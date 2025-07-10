import type { Database } from "@api/db";
import type {
	ApiKeySelect,
	OrganizationSelect,
	WebsiteSelect,
} from "@api/db/schema";

export type RestContext = {
	Variables: {
		db: Database;
		apiKey: ApiKeySelect;
		organization: OrganizationSelect;
		website: WebsiteSelect;
	};
};
