import type { Contributor } from "@/data/mockSolutionSpaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function statusTone(status: Contributor["status"]) {
  return status === "active"
    ? "bg-[oklch(from_var(--foreground)_l_c_h_/_0.45)]"
    : "bg-[oklch(from_var(--foreground)_l_c_h_/_0.18)]";
}

function PersonRow({ contributor }: { contributor: Contributor }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            "relative flex size-9 items-center justify-center rounded-full",
            "bg-background/35 ring-1 ring-foreground/10",
            "text-xs font-medium text-foreground/85"
          )}
          aria-hidden="true"
        >
          {contributor.initials}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background",
              statusTone(contributor.status)
            )}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground/90">
              {contributor.name}
            </p>
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              {contributor.status}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {contributor.role}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Interest: <span className="text-foreground/80">{contributor.interest}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ContributorPanel({
  contributors,
}: {
  contributors: Contributor[];
}) {
  return (
    <Card className="bg-card/55 ring-1 ring-foreground/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm">Contributors</CardTitle>
        <p className="text-xs text-muted-foreground">
          Active collaborators and roles in this space.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {contributors.map((c, idx) => (
          <div key={c.name} className="space-y-4">
            <PersonRow contributor={c} />
            {idx < contributors.length - 1 ? (
              <div className="h-px bg-border/60" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
