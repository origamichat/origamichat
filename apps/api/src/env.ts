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
  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  UPSTASH_REDIS_REST_URL: getEnvVariable("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: getEnvVariable("UPSTASH_REDIS_REST_TOKEN"),
  BETTER_AUTH_URL: getEnvVariable("BETTER_AUTH_URL"),
  BETTER_AUTH_SECRET: getEnvVariable("BETTER_AUTH_SECRET"),
  API_KEY_SECRET: getEnvVariable("API_KEY_SECRET"),
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),
  PORT: +getEnvVariable("PORT", "8787"),
};
