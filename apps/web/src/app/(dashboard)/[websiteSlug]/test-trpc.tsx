"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

export default function TestTRPC() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.user.me.queryOptions());

  return <div>{data?.email} houla</div>;
}
