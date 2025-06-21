export const getAPIBaseUrl = (path: `/${string}`) => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api${path}`;
};

export const getTRPCUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/trpc`;
};
