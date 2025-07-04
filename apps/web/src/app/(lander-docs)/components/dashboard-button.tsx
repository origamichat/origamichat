import Link from "next/link";
import { getAuth } from "@/lib/auth/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { TopbarButton } from "../../../components/ui/topbar-button";

export function DashboardButtonSkeleton() {
  return (
    <Button className="min-w-24 rounded-full">
      <Skeleton className="size-4" />
    </Button>
  );
}

export async function DashboardButton() {
  const { user } = await getAuth();

  if (!user) {
    return (
      <>
        <TopbarButton href="/login" shortcuts={["l"]} tooltip="Login">
          Login
        </TopbarButton>
        <Link href="/">
          <Button className="rounded-full">Join the waitlist</Button>
        </Link>
      </>
    );
  }

  return (
    <Link href="/select">
      <Button className="h-auto rounded-full p-1 pr-3">
        <Avatar className="size-7">
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        Dashboard
      </Button>
    </Link>
  );
}
