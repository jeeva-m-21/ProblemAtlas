import Link from "next/link";

import type { Problem } from "@/lib/data/problems";
import type { ProfileProblemContribution } from "@/lib/data/profiles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

function stateTone(state: ProfileProblemContribution["state"]) {
  switch (state) {
    case "active":
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.42)]";
    case "watching":
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.26)]";
    default:
      return "bg-[oklch(from_var(--foreground)_l_c_h_/_0.14)]";
  }
}

export function ProfileProblemCard({
  problem,
  contribution,
}: {
  problem: Problem;
  contribution: ProfileProblemContribution;
}) {
  return (
    <Card
      className={cn(
        "bg-card/55 ring-1 ring-foreground/10",
        "transition-colors hover:bg-card/60"
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-sm">
              <Link
                href={`/problems/${problem.id}`}
                className={cn(
                  "text-foreground/95 hover:text-foreground",
                  "rounded-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {problem.title}
              </Link>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Last activity {contribution.lastActivityAt} · involvement {contribution.involvement}
            </p>
          </div>

          <Badge
            variant={domainVariant(problem.domain)}
            className="mt-0.5 shrink-0 bg-background/40 border-border/70"
          >
            {problem.domain}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {problem.summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn("size-1.5 rounded-full", stateTone(contribution.state))}
            />
            <p className="text-xs text-muted-foreground">
              State <span className="text-foreground/80">{contribution.state}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              spaces {contribution.joinedSolutionSpacesCount}
            </Badge>
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              feasibility {problem.feasibilityScore}/5
            </Badge>
          </div>
        </div>

        {contribution.note ? (
          <div className="rounded-xl border border-border/60 bg-background/35 p-3 ring-1 ring-foreground/5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Contribution note
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {contribution.note}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
