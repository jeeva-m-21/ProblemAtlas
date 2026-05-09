import Link from "next/link";
import type React from "react";

import type { SolutionSpace } from "@/data/mockSolutionSpaces";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function progressVariant(state: SolutionSpace["progressState"]):
  | "default"
  | "secondary"
  | "outline" {
  switch (state) {
    case "Shipping":
      return "default";
    case "Validating":
      return "secondary";
    default:
      return "outline";
  }
}

function activityTone(indicator: SolutionSpace["activity"]["indicator"]) {
  switch (indicator) {
    case "High":
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.42)]";
    case "Active":
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.28)]";
    default:
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.16)]";
  }
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2 ring-1 ring-foreground/5 hover:bg-background/55 transition-colors">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
        {label}
      </p>
      <div className="mt-0.5 text-sm font-medium tabular-nums text-foreground/90">
        {value}
      </div>
    </div>
  );
}

export function SolutionSpaceHeader({ space }: { space: SolutionSpace }) {
  return (
    <header className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Solution Space
            </p>
            <span className="text-muted-foreground/40">•</span>
            <p className="text-xs font-mono text-muted-foreground/85">
              SPC-{space.id}
            </p>
          </div>

          <Link
            href={`/problems/${space.problemId}`}
            className={cn(
              "text-xs text-muted-foreground hover:text-foreground",
              "rounded-md px-2 py-1",
              "hover:bg-accent/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            Parent problem
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {space.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={progressVariant(space.progressState)}
                className="bg-background/40 border-border/70"
              >
                {space.progressState}
              </Badge>
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/35 px-3 py-1 ring-1 ring-foreground/5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full",
                    activityTone(space.activity.indicator)
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {space.activity.indicator}
                </p>
              </div>
            </div>
          </div>

          <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Linked to{" "}
            <Link
              href={`/problems/${space.problemId}`}
              className={cn(
                "text-foreground/90 hover:text-foreground",
                "underline underline-offset-4 decoration-foreground/15 hover:decoration-foreground/25"
              )}
            >
              {space.problemTitle}
            </Link>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Created" value={space.createdAt} />
        <Stat label="Contributors" value={space.contributors.length} />
        <Stat label="Artifacts" value={space.artifacts.length} />
        <Stat label="Milestones" value={space.sidebar.collaborationStats.milestones} />
        <Stat label="Last active" value={space.activity.lastActiveAt} />
        <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2 ring-1 ring-foreground/5">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
            Domains
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {space.domainTags.map((d) => (
              <Badge
                key={d}
                variant="outline"
                className="bg-background/30 border-border/70"
              >
                {d}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
