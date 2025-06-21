import { db, user } from "@origamichat/database";

export async function checkHealth() {
  // This is a simple health check that will return true if the database is
  // This query should be cached by our multi region redis setup and improve latency worldwide

  await db
    .select()
    .from(user)
    .orderBy(user.createdAt)
    .limit(1)
    .$withCache({
      tag: "health-check",
      config: {
        ex: 600, // 10 minutes
      },
    });

  return true;
}
