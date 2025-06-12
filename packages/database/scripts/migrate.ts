import "dotenv/config";

import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "../src/database";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: `${__dirname}/../drizzle/migrations`,
    });

    console.log("Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

void main();
