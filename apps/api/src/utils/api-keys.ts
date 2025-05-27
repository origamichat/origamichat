import { randomBytes } from "node:crypto";

export function generateApiKey({
  type,
  isTest,
}: {
  type: "private" | "public";
  isTest: boolean;
}): string {
  let prefix = "";

  if (type === "private") {
    prefix = "sk_";
  } else if (type === "public") {
    prefix = "pk_";
  }

  if (isTest) {
    prefix = prefix + "test_";
  }

  // Generate 32 random bytes and convert to hex
  const randomString = randomBytes(32).toString("hex");
  return `${prefix}${randomString}`;
}

export function isValidSecretApiKeyFormat(key: string): boolean {
  return key.startsWith("sk_") && (key.length === 67 || key.length === 72);
}

export function isValidPublicApiKeyFormat(key: string): boolean {
  return key.startsWith("pk_") && (key.length === 67 || key.length === 72);
}
