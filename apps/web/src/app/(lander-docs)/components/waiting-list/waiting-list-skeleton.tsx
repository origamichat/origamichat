import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

export function WaitingListSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[592px] flex-col gap-4 rounded py-10 opacity-10 md:p-10",
        className
      )}
    >
      <div className="mb-10 flex items-center gap-10">
        <div className="flex flex-col gap-2">
          <p className="text-primary/60 text-sm">Your points</p>
          <p className="font-medium font-mono text-3xl text-primary">-</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-primary/60 text-sm">Your rank</p>
          <p className="font-medium font-mono text-3xl text-primary">-</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded border border-os-background-400 bg-os-background-300 font-medium text-primary/70 text-xs">
            1
          </span>
          <p className="font-medium text-sm">
            Share the wait list with your friends
          </p>
          <span className="ml-4 text-primary/70 text-xs">+5 points/friend</span>
        </div>
        <div className="mb-6 flex h-9 w-full items-center gap-2">
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded border border-os-background-400 bg-os-background-300 font-medium text-primary/70 text-xs">
            2
          </span>
          <p className="font-medium text-sm">Join our Discord</p>
          <span className="ml-4 text-primary/70 text-xs">+2 points</span>
        </div>
        <div className="mb-6 flex h-9 w-full items-center gap-2">
          <Skeleton className="relative h-6 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded border border-os-background-400 bg-os-background-300 font-medium text-primary/70 text-xs">
            3
          </span>
          <p className="font-medium text-sm">Preorder AI credits</p>
          <span className="ml-4 text-primary/70 text-xs">+1 point/credit</span>
        </div>
        <div className="mb-6 flex h-9 items-center gap-2">
          <Skeleton className="relative h-6 w-9 px-2" />
          <Skeleton className="relative h-6 w-9 px-2" />
          <Skeleton className="relative h-6 w-9 px-2" />
        </div>
      </div>
    </div>
  );
}
