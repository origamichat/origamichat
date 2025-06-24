import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

export function WaitingListSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-10 md:p-10 rounded-md max-w-[592px] w-full opacity-10",
        className
      )}
    >
      <div className="flex items-center gap-10 mb-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-primary/60">Your points</p>
          <p className="text-3xl text-primary font-medium font-mono">-</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-primary/60">Your rank</p>
          <p className="text-3xl text-primary font-medium font-mono">-</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded-md size-6 border border-os-background-400">
            1
          </span>
          <p className="font-medium text-sm">
            Share the wait list with your friends
          </p>
          <span className="text-xs text-primary/70 ml-4">+5 points/friend</span>
        </div>
        <div className="flex items-center gap-2 h-9 mb-6 w-full">
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded-md size-6 border border-os-background-400">
            2
          </span>
          <p className="font-medium text-sm">Join our Discord</p>
          <span className="text-xs text-primary/70 ml-4">+2 points</span>
        </div>
        <div className="flex items-center gap-2 h-9 mb-6 w-full">
          <Skeleton className="relative h-6 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary/70 bg-os-background-300 flex items-center justify-center rounded-md size-6 border border-os-background-400">
            3
          </span>
          <p className="font-medium text-sm">Preorder AI credits</p>
          <span className="text-xs text-primary/70 ml-4">+1 point/credit</span>
        </div>
        <div className="flex items-center gap-2 h-9 mb-6">
          <Skeleton className="relative h-6 w-9 px-2" />
          <Skeleton className="relative h-6 w-9 px-2" />
          <Skeleton className="relative h-6 w-9 px-2" />
        </div>
      </div>
    </div>
  );
}
