"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function TestTRPC() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(trpc.user.me.queryOptions());

  return <div>{data?.email} houla</div>;
}
