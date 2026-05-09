import type { TimelineEvent } from "@/data/mockSolutionSpaces";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function typeVariant(type: TimelineEvent["type"]):
  | "default"
  | "secondary"
  | "outline" {
  switch (type) {
    case "milestone":
      return "default";
    case "discovery":
      return "secondary";
    default:
      return "outline";
  }
}

export function ResearchTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card className="bg-card/55 ring-1 ring-foreground/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm">Research timeline</CardTitle>
        <p className="text-xs text-muted-foreground">
          Milestones, discoveries, and operational updates.
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-3 top-0 bottom-0 w-px bg-border/60"
          />

          <div className="space-y-6">
            {events.map((e) => (
              <div key={e.id} className="relative pl-10">
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1.5 top-1.5 size-4 rounded-full",
                    "bg-background ring-1 ring-foreground/12"
                  )}
                />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={typeVariant(e.type)}
                        className="bg-background/30 border-border/70"
                      >
                        {e.type}
                      </Badge>
                      <p className="text-sm font-medium text-foreground/90">
                        {e.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{e.createdAt}</p>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {e.detail}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono text-muted-foreground/85">
                        {e.actor.initials}
                      </span>
                      <span className="text-muted-foreground/40"> · </span>
                      <span>{e.actor.name}</span>
                    </p>

                    {e.tags && e.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {e.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="bg-background/30 border-border/70"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
