import { ensurePageAuth } from "@/lib/auth/server";

export default async function Auth() {
  const { session, user } = await ensurePageAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Origami</h1>
      <p>You're signed-in as {user.email}</p>
    </div>
  );
}
