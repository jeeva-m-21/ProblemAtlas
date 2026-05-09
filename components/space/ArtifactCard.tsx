import Link from "next/link";
import type React from "react";

import type { SolutionArtifact } from "@/data/mockSolutionSpaces";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  BookOpen,
  Database,
  FileText,
  GitBranch,
  Link2,
  Puzzle,
  SquareTerminal,
} from "lucide-react";

const ICON_BY_TYPE: Record<
  SolutionArtifact["type"],
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  "Research note": FileText,
  Prototype: SquareTerminal,
  "GitHub": GitBranch,
  "Architecture doc": Puzzle,
  Dataset: Database,
  Paper: BookOpen,
  Link: Link2,
};

function statusVariant(status: SolutionArtifact["status"]):
  | "default"
  | "secondary"
  | "outline" {
  switch (status) {
    case "active":
      return "secondary";
    case "archived":
      return "outline";
    default:
      return "outline";
  }
}

export function ArtifactCard({ artifact }: { artifact: SolutionArtifact }) {
  const Icon = ICON_BY_TYPE[artifact.type];
  const isLinked = Boolean(artifact.href);

  const content = (
    <Card
      className={cn(
        "bg-card/55 ring-1 ring-foreground/10",
        "transition-colors hover:bg-card/60"
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-background/35 ring-1 ring-foreground/10">
              <Icon className="size-4 text-muted-foreground" aria-hidden />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-sm truncate">{artifact.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {artifact.type} · {artifact.updatedAt}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant={statusVariant(artifact.status)}
              className="bg-background/30 border-border/70"
            >
              {artifact.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {artifact.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {artifact.signal ? (
            <div className="rounded-full border border-border/60 bg-background/35 px-3 py-1 ring-1 ring-foreground/5">
              <p className="text-xs text-muted-foreground">
                <span className="font-mono text-muted-foreground/85">
                  {artifact.signal.label}
                </span>
                <span className="text-muted-foreground/40"> · </span>
                <span className="font-medium text-foreground/80">
                  {artifact.signal.value}
                </span>
              </p>
            </div>
          ) : (
            <span />
          )}

          {artifact.href ? (
            <span className="text-xs text-muted-foreground">
              External link
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Local draft</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!isLinked) return content;

  return (
    <Link
      href={artifact.href!}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "block rounded-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      aria-label={`Open ${artifact.title} (external)`}
    >
      {content}
    </Link>
  );
}
