import { env } from "@api/env";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";

let _db: NodePgDatabase<typeof schema> | null = null;

const createDb = (): NodePgDatabase<typeof schema> => {
	if (_db) {
		return _db;
	}

	_db = drizzle({
		connection: {
			host: env.DATABASE_HOST,
			port: env.DATABASE_PORT,
			user: env.DATABASE_USERNAME,
			password: env.DATABASE_PASSWORD,
			database: env.DATABASE_NAME,
			ssl:
				env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
		},
		cache: upstashCache({
			url: env.UPSTASH_REDIS_REST_URL,
			token: env.UPSTASH_REDIS_REST_TOKEN,
			config: { ex: 60 },
		}),
	});

	return _db;
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export const db = new Proxy({} as Database, {
	get: (target, prop) => {
		const actualDb = createDb();
		return actualDb[prop as keyof typeof actualDb];
	},
});
