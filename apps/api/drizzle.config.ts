import type { Config } from "drizzle-kit";

function getEnvVariable(name: string) {
	const value = process.env[name];

	if (!value) {
		console.error(`environment variable ${name} not found`);
	}

	return value || "";
}

export default {
	schema: "./src/db/schema/*",
	out: "./drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		host: getEnvVariable("DATABASE_HOST"),
		port: +getEnvVariable("DATABASE_PORT"),
		user: getEnvVariable("DATABASE_USERNAME"),
		password: getEnvVariable("DATABASE_PASSWORD") || "",
		database: getEnvVariable("DATABASE_NAME"),
	},
	verbose: true,
} satisfies Config;
