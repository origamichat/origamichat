import "dotenv/config";

import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "@/database";

const main = async () => {
  await migrate(db, {
    migrationsFolder: `${__dirname}/../drizzle/migrations`,
  });

  await db.$client.end();
  process.exit(0);
};

void main();
