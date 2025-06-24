export function getAPIBaseUrl(path: `/${string}`) {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api${path}`;
}

export function getTRPCUrl() {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/trpc`;
}

export function getWaitlistUrl(referralId: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/j/${referralId}`;
}

export function getLandingBaseUrl() {
  return `${process.env.NEXT_PUBLIC_BASE_URL}`;
}
