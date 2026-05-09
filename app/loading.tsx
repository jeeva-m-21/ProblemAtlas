import { LoadingSkeleton } from "@/components/system/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          Loading
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Preparing the intelligence surface
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Calibrating context, stitching activity, and rendering panels.
        </p>
      </header>

      <LoadingSkeleton variant="detail" />
    </div>
  );
}
