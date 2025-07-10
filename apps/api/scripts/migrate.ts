import "dotenv/config";

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../src/db";

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

// biome-ignore lint/complexity/noVoid: false positive
void main();
