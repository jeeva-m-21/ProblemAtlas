import Link from "next/link";
import { Layers, Signal, Users } from "lucide-react";

import type { Problem } from "@/lib/data/problems";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProblemCardProps = {
  problem: Problem;
  className?: string;
};

function scopeLabel(scope: Problem["implementationScope"]) {
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

function domainVariant(domain: Problem["domain"]):
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

type Level = "Low" | "Medium" | "High";

function levelFromFeasibility(score: Problem["feasibilityScore"]): Level {
  if (score <= 2) return "Low";
  if (score === 3) return "Medium";
  return "High";
}

function impactLevel(interestedCount: number): Level {
  if (interestedCount >= 45) return "High";
  if (interestedCount >= 25) return "Medium";
  return "Low";
}

function demandScore(interestedCount: number): 1 | 2 | 3 | 4 | 5 {
  if (interestedCount >= 55) return 5;
  if (interestedCount >= 45) return 4;
  if (interestedCount >= 30) return 3;
  if (interestedCount >= 18) return 2;
  return 1;
}

function urgencyLevel(problem: Problem): Level {
  const demand = demandScore(problem.interestedCount);
  const supply = Math.min(5, Math.max(0, problem.activeSolutionSpacesCount));
  const gap = demand - supply;

  if (gap >= 3) return "High";
  if (gap === 2) return "Medium";
  return "Low";
}

function maturityLabel(spaces: number): "Early" | "Developing" | "Established" {
  if (spaces <= 0) return "Early";
  if (spaces <= 2) return "Developing";
  return "Established";
}

function collaborationDemand(problem: Problem): Level {
  const scopeBase: Level =
    problem.implementationScope === "large"
      ? "High"
      : problem.implementationScope === "medium"
        ? "Medium"
        : "Low";

  const early = problem.activeSolutionSpacesCount === 0;
  if (early && scopeBase === "Low") return "Medium";
  if (early && problem.feasibilityScore >= 4) return "High";
  return scopeBase;
}

function momentumLabel(problem: Problem): "Quiet" | "Active" | "Hot" {
  if (problem.activeSolutionSpacesCount >= 4 || problem.interestedCount >= 45) return "Hot";
  if (problem.activeSolutionSpacesCount >= 2 || problem.interestedCount >= 25) return "Active";
  return "Quiet";
}

function pillTone(value: string) {
  if (value === "High" || value === "Hot") {
    return "bg-foreground/5 text-foreground border-border/70";
  }
  if (value === "Medium" || value === "Active" || value === "Developing") {
    return "bg-background/40 text-foreground/85 border-border/60";
  }
  return "bg-background/30 text-muted-foreground border-border/60";
}

function urgencyTone(level: Level) {
  if (level === "High") {
    return "bg-destructive/10 text-destructive border-destructive/25";
  }
  if (level === "Medium") {
    return "bg-background/40 text-foreground/85 border-border/60";
  }
  return "bg-background/30 text-muted-foreground border-border/60";
}

function MetaPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
        "text-xs",
        className
      )}
    >
      <span className="text-[11px] font-mono text-muted-foreground/85">
        {label}
      </span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

export function ProblemCard({ problem, className }: ProblemCardProps) {
  const impact = impactLevel(problem.interestedCount);
  const urgency = urgencyLevel(problem);
  const feasibility = levelFromFeasibility(problem.feasibilityScore);
  const maturity = maturityLabel(problem.activeSolutionSpacesCount);
  const demand = collaborationDemand(problem);
  const momentum = momentumLabel(problem);

  return (
    <Card
      className={cn(
        "h-full",
        "bg-card/55",
        "ring-1 ring-foreground/10",
        "shadow-[0_1px_0_0_oklch(from_var(--foreground)_l_c_h_/_0.02)]",
        "transition-colors",
        "hover:bg-card/60",
        className
      )}
    >
      <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-[15px] leading-snug">
              <Link
                href={`/problems/${problem.id}`}
                className={cn(
                  "text-foreground/95 hover:text-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "rounded-sm"
                )}
              >
                {problem.title}
              </Link>
            </CardTitle>

            <Badge
              variant={domainVariant(problem.domain)}
              className="mt-0.5 shrink-0 bg-background/40 border-border/70"
            >
              {problem.domain}
            </Badge>
          </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {problem.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          <MetaPill
            label="Impact"
            value={impact}
            className={cn("border", pillTone(impact))}
          />
          <MetaPill
            label="Urgency"
            value={urgency}
            className={cn("border", urgencyTone(urgency))}
          />
          <MetaPill
            label="Feasible"
            value={`${problem.feasibilityScore}/5 · ${feasibility}`}
            className={cn("border", pillTone(feasibility))}
          />
          <MetaPill
            label="Maturity"
            value={maturity}
            className={cn("border", pillTone(maturity))}
          />
          <MetaPill
            label="Collab"
            value={demand}
            className={cn("border", pillTone(demand))}
          />
          <MetaPill
            label="Momentum"
            value={momentum}
            className={cn("border", pillTone(momentum))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2">
            <Signal className="size-4 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                Feasibility
              </p>
              <p className="text-sm font-medium tabular-nums text-foreground/90">
                {problem.feasibilityScore}/5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2">
            <Layers className="size-4 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                Scope
              </p>
              <p className="text-sm font-medium text-foreground/90">
                {scopeLabel(problem.implementationScope)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="size-4" aria-hidden="true" />
            <span className="tabular-nums">{problem.interestedCount}</span>
            <span>interested</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="tabular-nums font-medium text-foreground/85">
              {problem.activeSolutionSpacesCount}
            </span>
            <span>spaces</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
