import type { Config } from "drizzle-kit";

const getEnvVariable = (name: string) => {
	const value = process.env[name];
	if (value == null) {
		// During build time, provide fallback values to prevent build failures
		if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
			console.warn(
				`Warning: Environment variable ${name} not found during build, using placeholder`
			);
			return "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
		}
		throw new Error(`environment variable ${name} not found`);
	}
	return value;
};

export default {
	schema: "./src/db/schema/index.ts",
	out: "./drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: getEnvVariable("DATABASE_URL"),
	},
} satisfies Config;
