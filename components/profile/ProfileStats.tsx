import type React from "react";

import { Signal, Users, Layers, FileText } from "lucide-react";

import type { Profile } from "@/lib/data/profiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: number;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const EASED_BG =
  "bg-[radial-gradient(900px_220px_at_30%_-40px,oklch(from_var(--foreground)_l_c_h_/_0.04),transparent_60%)]";

export function ProfileStats({ profile }: { profile: Profile }) {
  const stats: Stat[] = [
    {
      label: "Problems contributed",
      value: profile.metrics.problemsContributed,
      description: "High-signal problems reviewed or advanced.",
      icon: Signal,
    },
    {
      label: "Active spaces",
      value: profile.metrics.activeSolutionSpaces,
      description: "Workspaces currently in motion.",
      icon: Layers,
    },
    {
      label: "Research discussions",
      value: profile.metrics.researchDiscussions,
      description: "Technical threads with decisions and critique.",
      icon: Users,
    },
    {
      label: "Artifacts published",
      value: profile.metrics.artifactsPublished,
      description: "Docs, prototypes, and datasets shared.",
      icon: FileText,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground/85">Metrics</p>
        <h2 className="text-lg font-semibold tracking-tight">Profile stats</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className={cn(
                "bg-card/55 ring-1 ring-foreground/10",
                "transition-colors hover:bg-card/60",
                "relative",
                EASED_BG
              )}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">{s.label}</CardTitle>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-background/35 ring-1 ring-foreground/10">
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums tracking-tight">
                  {s.value}
                </p>
              </CardContent>
            </Card>
          );
        })}

        <Card className="bg-card/55 ring-1 ring-foreground/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm">Collaboration score</CardTitle>
            <p className="text-xs text-muted-foreground">
              Non-gamified signal of breadth + consistency.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-xs font-mono text-muted-foreground/85">0–100</p>
            </div>
            <div className="h-2 rounded-full bg-background/40 ring-1 ring-foreground/8 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  "bg-[linear-gradient(to_right,oklch(from_var(--foreground)_l_c_h_/_0.12),oklch(from_var(--foreground)_l_c_h_/_0.26))]"
                )}
                style={{ width: `${Math.min(100, Math.max(0, profile.metrics.collaborationScore))}%` }}
                aria-hidden
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Computed from sustained collaboration, artifact quality, and review behavior. Not a popularity metric.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
