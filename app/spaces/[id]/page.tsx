import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";

import { getSpaceById } from "@/lib/data/spaces";
import { SolutionSpaceHeader } from "@/components/space/SolutionSpaceHeader";
import { ArtifactCard } from "@/components/space/ArtifactCard";
import { ContributorPanel } from "@/components/space/ContributorPanel";
import { ResearchTimeline } from "@/components/space/ResearchTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const space = Number.isFinite(id) ? await getSpaceById(id) : undefined;

  if (!space) {
    return { title: "Solution space", description: "Collaborative workspace" };
  }

  return {
    title: space.title,
    description: `Solution space for ${space.problemTitle}`,
  };
}

function SectionShell({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-700",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground/85">{eyebrow}</p>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function meterLabel(value: number) {
  if (value <= 2) return "Low";
  if (value === 3) return "Medium";
  return "High";
}

function Meter({
  label,
  value,
  hint,
}: {
  label: string;
  value: 1 | 2 | 3 | 4 | 5;
  hint: string;
}) {
  const percent = (value / 5) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-xs font-mono text-muted-foreground/85">
          {value}/5 · {meterLabel(value)}
        </p>
      </div>
      <div className="h-2 rounded-full bg-background/40 ring-1 ring-foreground/8 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            "bg-[linear-gradient(to_right,oklch(from_var(--foreground)_l_c_h_/_0.12),oklch(from_var(--foreground)_l_c_h_/_0.24))]"
          )}
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}

export default async function SolutionSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const space = await getSpaceById(id);
  if (!space) notFound();

  return (
    <div className="space-y-10">
      <SolutionSpaceHeader space={space} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-10">
          <SectionShell eyebrow="Overview" title="Working hypothesis and strategy">
            <Card className="bg-card/55 ring-1 ring-foreground/10">
              <CardContent className="space-y-6 pt-2">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground">
                      Solution direction
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {space.overview.direction}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground">
                      Research hypothesis
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {space.overview.hypothesis}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border/60" />

                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    Engineering strategy
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {space.overview.strategy}
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/35 p-4 ring-1 ring-foreground/5">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    Implementation goals
                  </p>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {space.overview.goals.map((g) => (
                      <li key={g} className="flex gap-2">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </SectionShell>

          <SectionShell eyebrow="Artifacts" title="Research and engineering artifacts">
            <div className="grid gap-4 md:grid-cols-2">
              {space.artifacts.map((a) => (
                <ArtifactCard key={a.id} artifact={a} />
              ))}
            </div>
          </SectionShell>

          <SectionShell eyebrow="Contributors" title="Collaborative surface">
            <ContributorPanel contributors={space.contributors} />
          </SectionShell>

          <SectionShell eyebrow="Timeline" title="Milestones and updates">
            <ResearchTimeline events={space.timeline} />
          </SectionShell>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            <Card className="bg-card/55 ring-1 ring-foreground/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-sm">Workspace panel</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Intelligence sidebar (MVP, UI-only).
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" aria-label="Open task board (UI only)">
                  Open tasks
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  aria-label="Share workspace (UI only)"
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  aria-label="Create artifact (UI only)"
                >
                  New artifact
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/55 ring-1 ring-foreground/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-sm">Collaboration stats</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Activity and throughput signals.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["Contributors", space.sidebar.collaborationStats.contributors],
                    ["Active today", space.sidebar.collaborationStats.activeToday],
                    ["Artifacts", space.sidebar.collaborationStats.artifacts],
                    ["Milestones", space.sidebar.collaborationStats.milestones],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border/60 bg-background/35 px-3 py-2 ring-1 ring-foreground/5"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground/90">
                      {value}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/55 ring-1 ring-foreground/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-sm">Open tasks</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Next actions to unblock research velocity.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {space.sidebar.openTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/35 px-3 py-2 ring-1 ring-foreground/5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/90 leading-snug">
                        {t.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t.status}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 bg-background/30 border-border/70"
                    >
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/55 ring-1 ring-foreground/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-sm">Research confidence</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Current confidence in the direction.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Meter
                  label="Confidence"
                  value={space.sidebar.researchConfidence}
                  hint="Subjective signal: quality of evidence + stability of approach."
                />
                <div className="h-px bg-border/60" />
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    Feasibility changes
                  </p>
                  <div className="space-y-2">
                    {space.sidebar.feasibilityChanges.map((c) => (
                      <div
                        key={c.createdAt}
                        className="rounded-xl border border-border/60 bg-background/35 px-3 py-2 ring-1 ring-foreground/5"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-xs text-muted-foreground">
                            {c.createdAt}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground/85">
                            {c.from}→{c.to}
                          </p>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {c.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
