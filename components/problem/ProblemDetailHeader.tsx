import Link from "next/link";
import type React from "react";

import type { ProblemDetail } from "@/data/mockProblemDetails";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function scopeLabel(scope: ProblemDetail["implementationScope"]) {
  switch (scope) {
    case "small":
      return "Small";
    case "medium":
      return "Medium";
    case "large":
      return "Large";
    default:
      return scope satisfies never;
  }
}

function domainVariant(domain: ProblemDetail["domain"]):
  | "default"
  | "secondary"
  | "outline" {
  switch (domain) {
    case "AI/ML":
      return "default";
    case "DevTools & Systems":
      return "secondary";
    default:
      return "outline";
  }
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-background/40 ring-1 ring-foreground/5",
        "px-3 py-2",
        "transition-colors",
        "hover:bg-background/55",
        className
      )}
    >
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
        {label}
      </p>
      <div className="mt-0.5 text-sm font-medium tabular-nums text-foreground/90">
        {value}
      </div>
    </div>
  );
}

export function ProblemDetailHeader({ problem }: { problem: ProblemDetail }) {
  return (
    <header className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Intelligence Dossier
            </p>
            <span className="text-muted-foreground/40">•</span>
            <p className="text-xs font-mono text-muted-foreground/85">
              PRB-{problem.id}
            </p>
          </div>

          <Link
            href="/explore"
            className={cn(
              "text-xs text-muted-foreground hover:text-foreground",
              "rounded-md px-2 py-1",
              "hover:bg-accent/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            Back to Explore
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {problem.title}
            </h1>

            <Badge
              variant={domainVariant(problem.domain)}
              className="mt-1 bg-background/40 border-border/70"
            >
              {problem.domain}
            </Badge>
          </div>

          <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            {problem.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Feasibility" value={`${problem.feasibilityScore}/5`} />
        <Stat
          label="Scope"
          value={<span className="capitalize">{scopeLabel(problem.implementationScope)}</span>}
        />
        <Stat label="Created" value={problem.createdAt} />
        <Stat label="Interested" value={problem.interestedCount} />
        <Stat label="Active Spaces" value={problem.activeSolutionSpacesCount} />
        <Stat label="Difficulty" value={`${problem.implementationDifficulty}/5`} />
      </div>
    </header>
  );
}
