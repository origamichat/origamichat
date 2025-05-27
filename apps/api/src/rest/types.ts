import { Database, OrganizationSelect } from "@repo/database";

export type RestContext = {
  Variables: {
    db: Database;
    organization: OrganizationSelect;
    organizationId: string;
  };
};
