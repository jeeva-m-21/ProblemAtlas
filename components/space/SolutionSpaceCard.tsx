import Link from "next/link";
import type React from "react";

import type { SolutionSpace } from "@/data/mockSolutionSpaces";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SpaceStage = "Exploring" | "Validating" | "Building" | "Stalled" | "Published";

type StageTone = "default" | "secondary" | "outline";

function daysSince(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return Number.POSITIVE_INFINITY;
  const deltaMs = Date.now() - d.getTime();
  return Math.floor(deltaMs / (1000 * 60 * 60 * 24));
}

function deriveStage(space: SolutionSpace): SpaceStage {
  const quietLong = space.activity.indicator === "Quiet" && daysSince(space.activity.lastActiveAt) >= 35;
  if (quietLong) return "Stalled";

  switch (space.progressState) {
    case "Shipping":
      return "Published";
    case "Prototyping":
      return "Building";
    case "Validating":
      return "Validating";
    case "Exploring":
      return "Exploring";
    default:
      return space.progressState satisfies never;
  }
}

function stageVariant(stage: SpaceStage): StageTone {
  switch (stage) {
    case "Published":
      return "default";
    case "Building":
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

function maturityLabel(space: SolutionSpace): "Early" | "Developing" | "Mature" {
  const stage = deriveStage(space);
  if (stage === "Published") return "Mature";
  if (stage === "Building") return "Developing";
  if (space.sidebar.researchConfidence >= 4) return "Developing";
  return "Early";
}

function contributorDemand(space: SolutionSpace): "Low" | "Medium" | "High" {
  const open = space.sidebar.openTasks.filter((t) => t.status !== "done").length;
  if (space.sidebar.collaborationStats.activeToday === 0 && open >= 2) return "High";
  if (open >= 2) return "Medium";
  if (space.sidebar.collaborationStats.contributors <= 2) return "Medium";
  return "Low";
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
        "rounded-xl border border-border/60 bg-background/30 px-3 py-2",
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

export function SolutionSpaceCard({
  space,
  className,
}: {
  space: SolutionSpace;
  className?: string;
}) {
  const stage = deriveStage(space);
  const maturity = maturityLabel(space);
  const demand = contributorDemand(space);

  const openTasks = space.sidebar.openTasks.filter((t) => t.status !== "done").length;

  return (
    <Card
      className={cn(
        "h-full",
        "bg-card/55",
        "ring-1 ring-foreground/10",
        "transition-colors hover:bg-card/60",
        className
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-[15px] leading-snug">
            <Link
              href={`/spaces/${space.id}`}
              className={cn(
                "text-foreground/95 hover:text-foreground",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "rounded-sm"
              )}
            >
              {space.title}
            </Link>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Badge
              variant={stageVariant(stage)}
              className="shrink-0 bg-background/40 border-border/70"
            >
              {stage}
            </Badge>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/35 px-3 py-1">
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

        <p className="text-xs text-muted-foreground">
          Linked to{" "}
          <Link
            href={`/problems/${space.problemId}`}
            className={cn(
              "text-foreground/85 hover:text-foreground",
              "underline underline-offset-4 decoration-foreground/15 hover:decoration-foreground/25"
            )}
          >
            {space.problemTitle}
          </Link>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {space.overview.direction}
        </p>

        <div className="flex flex-wrap gap-2">
          {space.domainTags.slice(0, 2).map((d) => (
            <Badge
              key={d}
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              {d}
            </Badge>
          ))}
          {space.domainTags.length > 2 ? (
            <Badge variant="outline" className="bg-background/30 border-border/70">
              +{space.domainTags.length - 2}
            </Badge>
          ) : null}

          <Badge
            variant="outline"
            className={cn(
              "bg-background/30 border-border/70",
              demand === "High" ? "text-destructive border-destructive/25 bg-destructive/10" : undefined
            )}
          >
            Demand: {demand}
          </Badge>
          <Badge variant="outline" className="bg-background/30 border-border/70">
            Maturity: {maturity}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Contributors" value={space.sidebar.collaborationStats.contributors} />
          <Stat label="Active today" value={space.sidebar.collaborationStats.activeToday} />
          <Stat label="Open tasks" value={openTasks} />
          <Stat label="Confidence" value={`${space.sidebar.researchConfidence}/5`} />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-3">
          <p className="text-xs text-muted-foreground">
            Last active{" "}
            <span className="font-mono text-foreground/70">{space.activity.lastActiveAt}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            SPC-<span className="font-mono text-foreground/70">{space.id}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
