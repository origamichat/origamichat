"use client";

import TestTRPC from "./TestTRPC";
import { useSession } from "@/lib/auth/client";

export default function Auth() {
  const { data } = useSession();

  console.log({ data });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Origami</h1>
      <p>You're signed-in as {data?.user?.email}</p>
      <TestTRPC />
    </div>
  );
}
