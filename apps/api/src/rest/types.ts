import {
  ApiKeySelect,
  Database,
  OrganizationSelect,
  WebsiteSelect,
} from "@repo/database";

export type RestContext = {
  Variables: {
    db: Database;
    apiKey: ApiKeySelect;
    organization: OrganizationSelect;
    website: WebsiteSelect;
  };
};
