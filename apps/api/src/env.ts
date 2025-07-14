const getEnvVariable = (name: string, defaultValue?: string): string => {
	const value = process.env[name];

	if (value == null) {
		if (defaultValue == null) {
			// During build time, provide fallback values to prevent build failures
			if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
				console.warn(
					`Warning: Environment variable ${name} not found during build, using placeholder`
				);
				return "build-time-placeholder";
			}
			throw new Error(`environment variable ${name} not found`);
		}
		return defaultValue;
	}

	return value;
};

export const env = {
	NODE_ENV: getEnvVariable("NODE_ENV"),
	DATABASE_HOST: getEnvVariable("DATABASE_HOST"),
	DATABASE_PORT: +getEnvVariable("DATABASE_PORT"),
	DATABASE_USERNAME: getEnvVariable("DATABASE_USERNAME"),
	DATABASE_PASSWORD: getEnvVariable("DATABASE_PASSWORD"),
	DATABASE_NAME: getEnvVariable("DATABASE_NAME"),
	UPSTASH_REDIS_REST_URL: getEnvVariable("UPSTASH_REDIS_REST_URL"),
	UPSTASH_REDIS_REST_TOKEN: getEnvVariable("UPSTASH_REDIS_REST_TOKEN"),
	BETTER_AUTH_URL: getEnvVariable("BETTER_AUTH_URL"),
	BETTER_AUTH_SECRET: getEnvVariable("BETTER_AUTH_SECRET"),
	API_KEY_SECRET: getEnvVariable("API_KEY_SECRET"),
	GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
	GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),
	GITHUB_CLIENT_ID: getEnvVariable("GITHUB_CLIENT_ID"),
	GITHUB_CLIENT_SECRET: getEnvVariable("GITHUB_CLIENT_SECRET"),
	RESEND_API_KEY: getEnvVariable("RESEND_API_KEY"),
	RESEND_AUDIENCE_ID: getEnvVariable("RESEND_AUDIENCE_ID"),
	PUBLIC_APP_URL: getEnvVariable("PUBLIC_APP_URL"),
	PORT: +getEnvVariable("PORT", "8787"),
	QSTASH_TOKEN: getEnvVariable("QSTASH_TOKEN"),
	QSTASH_CURRENT_SIGNING_KEY: getEnvVariable("QSTASH_CURRENT_SIGNING_KEY"),
	QSTASH_NEXT_SIGNING_KEY: getEnvVariable("QSTASH_NEXT_SIGNING_KEY"),
	QSTASH_URL: getEnvVariable("QSTASH_URL"),
};
