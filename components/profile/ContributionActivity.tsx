import Link from "next/link";

import type { ProfileActivityEvent } from "@/data/mockProfiles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function typeVariant(type: ProfileActivityEvent["type"]):
  | "default"
  | "secondary"
  | "outline" {
  switch (type) {
    case "discovery":
      return "secondary";
    case "decision":
      return "default";
    default:
      return "outline";
  }
}

function entityHref(event: ProfileActivityEvent): string | undefined {
  if (!event.entity) return undefined;
  if (event.entity.kind === "problem") return `/problems/${event.entity.id}`;
  return `/spaces/${event.entity.id}`;
}

export function ContributionActivity({
  events,
}: {
  events: ProfileActivityEvent[];
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground/85">History</p>
        <h2 className="text-lg font-semibold tracking-tight">Contribution activity</h2>
      </div>

      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Activity feed</CardTitle>
          <p className="text-xs text-muted-foreground">
            Engineering/research history (not a social feed).
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-3 top-0 bottom-0 w-px bg-border/60"
            />

            <div className="space-y-6">
              {events.map((e) => {
                const href = entityHref(e);
                const entity = e.entity;

                return (
                  <div key={e.id} className="relative pl-10">
                    <div
                      aria-hidden
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
                        <p className="text-xs text-muted-foreground">
                          {e.createdAt}
                        </p>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {e.detail}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {href && entity ? (
                          <Link
                            href={href}
                            className={cn(
                              "text-xs text-foreground/85 hover:text-foreground",
                              "rounded-md px-2 py-1",
                              "hover:bg-accent/30",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            )}
                          >
                            {entity.kind === "problem" ? "Problem" : "Space"}: {entity.label}
                          </Link>
                        ) : (
                          <span />
                        )}

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
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
