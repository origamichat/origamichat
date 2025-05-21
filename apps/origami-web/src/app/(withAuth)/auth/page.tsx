import { auth } from "api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Auth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Origami</h1>
      <p>You're signed-in as {session.user.email}</p>
    </div>
  );
}
