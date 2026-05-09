import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonBlock({ className }: { className: string }) {
  return (
    <Skeleton
      className={cn(
        "bg-background/20 ring-1 ring-foreground/5",
        "rounded-xl",
        className
      )}
    />
  );
}

function Lines({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonBlock key={idx} className={cn("h-3", idx === count - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export type LoadingSkeletonVariant =
  | "cards"
  | "sidebar"
  | "list"
  | "detail"
  | "discussion";

export function LoadingSkeleton({
  variant = "cards",
  className,
}: {
  variant?: LoadingSkeletonVariant;
  className?: string;
}) {
  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-4", className)}>
        <SkeletonBlock className="h-10" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-32" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-3">
                <SkeletonBlock className="h-4 w-64" />
                <Lines count={3} />
              </div>
              <div className="shrink-0 space-y-2">
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("space-y-8", className)}>
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-9 w-[min(560px,90%)]" />
          <Lines count={4} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5 p-5"
              >
                <SkeletonBlock className="h-4 w-44" />
                <div className="pt-4">
                  <Lines count={5} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "discussion") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5 p-4">
          <SkeletonBlock className="h-10" />
          <div className="pt-4">
            <Lines count={3} />
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5 p-4"
            >
              <div className="flex items-start gap-3">
                <SkeletonBlock className="size-9 rounded-full" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-3 w-16" />
                  </div>
                  <Lines count={4} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: 9 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5 p-4"
        >
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-2/3" />
            <Lines count={3} />
            <div className="flex items-center justify-between gap-3 pt-2">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
