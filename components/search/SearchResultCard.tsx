import Link from "next/link";

import type { SearchResult, SearchResultType } from "@/lib/data/search";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  FileText,
  Layers,
  MessageSquare,
  Package,
  Signal,
  Users,
} from "lucide-react";

function typeLabel(type: SearchResultType) {
  switch (type) {
    case "problem":
      return "Problem";
    case "space":
      return "Space";
    case "researcher":
      return "Researcher";
    case "artifact":
      return "Artifact";
    case "discussion":
      return "Discussion";
    default:
      return "Result";
  }
}

const ICON_BY_TYPE: Record<SearchResultType, typeof FileText> = {
  problem: Layers,
  space: Signal,
  researcher: Users,
  artifact: Package,
  discussion: MessageSquare,
};

function activityVariant(level: SearchResult["activityLevel"]): "secondary" | "outline" {
  if (level === "high") return "secondary";
  return "outline";
}

function initials(label: string) {
  const parts = label
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + second).toUpperCase();
}

export function SearchResultCard({ result }: { result: SearchResult }) {
  const Icon = ICON_BY_TYPE[result.type];

  return (
    <Card
      className={cn(
        "bg-card/55 ring-1 ring-foreground/10",
        "transition-colors hover:bg-card/60",
        "overflow-hidden"
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-background/35 ring-1 ring-foreground/10">
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-sm leading-tight">
                <Link
                  href={result.href}
                  className={cn(
                    "hover:text-foreground text-foreground/95",
                    "transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "rounded-md"
                  )}
                >
                  {result.title}
                </Link>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                <span className="font-mono">{typeLabel(result.type)}</span> · {result.updatedAt}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant={activityVariant(result.activityLevel)}
              className="bg-background/30 border-border/70"
            >
              {result.activityLevel}
            </Badge>
            <Badge variant="outline" className="bg-background/30 border-border/70">
              {result.collaboration}
            </Badge>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {result.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {result.domains.map((d) => (
            <Badge
              key={d}
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              {d}
            </Badge>
          ))}

          {result.type === "problem" ? (
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              feasibility {result.feasibilityScore}/5
            </Badge>
          ) : null}

          {result.type === "problem" ? (
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              scope {result.implementationScope}
            </Badge>
          ) : null}

          {result.type === "space" ? (
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              stage {result.stage}
            </Badge>
          ) : null}

          {result.type === "artifact" ? (
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              {result.artifactType}
            </Badge>
          ) : null}

          {result.type === "discussion" ? (
            <Badge
              variant="outline"
              className="bg-background/30 border-border/70"
            >
              {result.replies} replies
            </Badge>
          ) : null}
        </div>

        {result.signals && result.signals.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {result.signals.slice(0, 3).map((s) => (
              <span
                key={`${s.label}-${s.value}`}
                className="rounded-full bg-background/25 px-3 py-1 text-xs text-muted-foreground ring-1 ring-foreground/10"
              >
                <span className="font-mono text-foreground/70">{s.label}</span>{" "}
                <span className="text-muted-foreground">{s.value}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground/85">contributors</span>
            <div className="flex -space-x-2">
              {result.contributors.slice(0, 3).map((c) => (
                <span
                  key={c.handle}
                  title={`${c.label} (@${c.handle})`}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full",
                    "bg-background/35 ring-1 ring-foreground/10",
                    "text-[0.7rem] font-medium text-muted-foreground"
                  )}
                >
                  {initials(c.label)}
                </span>
              ))}
              {result.contributors.length > 3 ? (
                <span className="flex size-7 items-center justify-center rounded-full bg-background/35 ring-1 ring-foreground/10 text-[0.7rem] font-medium text-muted-foreground">
                  +{result.contributors.length - 3}
                </span>
              ) : null}
              {result.contributors.length === 0 ? (
                <span className="text-xs text-muted-foreground">—</span>
              ) : null}
            </div>
          </div>

          {result.type === "space" ? (
            <p className="text-xs text-muted-foreground">
              {result.artifactsCount} artifacts · {result.threadsActive} active threads
            </p>
          ) : null}

          {result.type === "problem" ? (
            <p className="text-xs text-muted-foreground">
              {result.activeSpaces} active spaces
            </p>
          ) : null}

          {result.type === "researcher" && result.contributions ? (
            <p className="text-xs text-muted-foreground">
              {result.contributions.spaces} spaces · {result.contributions.artifacts} artifacts
            </p>
          ) : null}

          {result.type === "discussion" ? (
            <p className="text-xs text-muted-foreground">
              {result.participants} participants · last: {result.lastSignal}
            </p>
          ) : null}

          {result.type === "artifact" ? (
            <p className="text-xs text-muted-foreground">status: {result.status}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
