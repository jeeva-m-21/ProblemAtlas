import type React from "react";

import type { Profile } from "@/data/mockProfiles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function activityTone(indicator: Profile["collaboration"]["indicator"]) {
  switch (indicator) {
    case "High":
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.42)]";
    case "Active":
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.28)]";
    default:
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.16)]";
  }
}

function MetricChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full border border-border/60 bg-background/35 px-3 py-1 ring-1 ring-foreground/5">
      <p className="text-xs text-muted-foreground">
        <span className="font-mono text-muted-foreground/85">{label}</span>
        <span className="text-muted-foreground/40"> · </span>
        <span className="font-medium tabular-nums text-foreground/80">
          {value}
        </span>
      </p>
    </div>
  );
}

export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={cn(
              "relative flex size-14 items-center justify-center rounded-2xl",
              "bg-background/35 ring-1 ring-foreground/12",
              "text-base font-medium text-foreground/90",
              "shadow-[0_1px_0_0_oklch(from_var(--foreground)_l_c_h_/_0.03)]"
            )}
            aria-hidden="true"
          >
            {profile.initials}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -right-1 -bottom-1 size-3 rounded-full ring-2 ring-background",
                activityTone(profile.collaboration.indicator)
              )}
            />
          </div>

          <div className="min-w-0 space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                Research identity
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {profile.name}
                </h1>
                <p className="text-sm text-muted-foreground">{profile.title}</p>
              </div>
            </div>

            <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {profile.domains.map((d) => (
                <Badge
                  key={d}
                  variant="outline"
                  className="h-7 px-3 text-[0.8rem] bg-background/35 border-border/70"
                >
                  {d}
                </Badge>
              ))}

              {profile.collaboration.org ? (
                <Badge
                  variant="outline"
                  className="h-7 px-3 text-[0.8rem] bg-background/35 border-border/70 font-mono"
                >
                  {profile.collaboration.org}
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <MetricChip label="collaborators" value={profile.collaboration.collaborators} />
              <MetricChip label="active" value={profile.metrics.activeSolutionSpaces} />
              <MetricChip label="artifacts" value={profile.metrics.artifactsPublished} />
              <MetricChip label="discussions" value={profile.metrics.researchDiscussions} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button aria-label="Request collaboration (UI only)">
            Request collaboration
          </Button>
          <Button
            variant="outline"
            className="bg-background/30 border-border/70"
            aria-label="Follow profile (UI only)"
          >
            Follow
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/40 ring-1 ring-foreground/5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-mono text-muted-foreground/85">
              Signal
            </p>
            <p className="text-sm text-foreground/90">
              {profile.collaboration.indicator} collaboration tempo · last active {profile.collaboration.lastActiveAt}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            This page is an intelligence-style record, not a social feed.
          </p>
        </div>
      </div>
    </header>
  );
}
