import type { ProblemDiscussionComment as ProblemComment } from "@/lib/data/problems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function InitialAvatar({ initials }: { initials: string }) {
  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-full",
        "bg-background/35 ring-1 ring-foreground/10",
        "text-xs font-medium text-foreground/85"
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function CommentRow({ comment }: { comment: ProblemComment }) {
  return (
    <div className="flex gap-3">
      <InitialAvatar initials={comment.author.initials} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground/90">
              {comment.author.name}
            </p>
            <span className="text-muted-foreground/40">•</span>
            <p className="text-xs font-mono text-muted-foreground/85">
              {comment.author.role}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {comment.body}
        </p>

        {comment.tags && comment.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {comment.tags.map((t) => (
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
  );
}

export function ProblemDiscussionPreview({
  comments,
  totalCount,
}: {
  comments: ProblemComment[];
  totalCount: number;
}) {
  return (
    <Card className="bg-card/55 ring-1 ring-foreground/10">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm">Discussion preview</CardTitle>
            <p className="text-xs text-muted-foreground">
              Research notes and technical debate (mock).
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="bg-background/35 border-border/70"
            aria-label="Open discussion (UI only)"
          >
            View all ({totalCount})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {comments.map((comment, idx) => (
          <div key={comment.id} className="space-y-4">
            <CommentRow comment={comment} />
            {idx < comments.length - 1 ? (
              <div className="h-px bg-border/60" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
