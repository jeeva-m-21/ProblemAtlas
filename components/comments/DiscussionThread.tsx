import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiscussionComment, DiscussionThread } from "@/lib/data/comments";

import { CommentCard } from "@/components/comments/CommentCard";
import { DiscussionComposer } from "@/components/comments/DiscussionComposer";
import { EmptyDiscussionState } from "@/components/comments/EmptyDiscussionState";

function buildTree(comments: DiscussionComment[]) {
  const byId = new Map<string, DiscussionComment>();
  const children = new Map<string, DiscussionComment[]>();

  for (const c of comments) {
    byId.set(c.id, c);
    if (c.parentId) {
      const list = children.get(c.parentId) ?? [];
      list.push(c);
      children.set(c.parentId, list);
    }
  }

  const roots = comments.filter((c) => !c.parentId || !byId.has(c.parentId));

  return { roots, children };
}

function RenderNode({
  comment,
  depth,
  childrenMap,
}: {
  comment: DiscussionComment;
  depth: number;
  childrenMap: Map<string, DiscussionComment[]>;
}) {
  const replies = childrenMap.get(comment.id) ?? [];

  return (
    <div className="space-y-3">
      <CommentCard
        comment={comment}
        depth={depth}
        tone={depth > 0 ? "reply" : "default"}
      />
      {replies.length > 0 ? (
        <div className="space-y-3">
          {replies.map((r) => (
            <RenderNode
              key={r.id}
              comment={r}
              depth={depth + 1}
              childrenMap={childrenMap}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DiscussionThread({
  thread,
  showComposer = true,
}: {
  thread: DiscussionThread;
  showComposer?: boolean;
}) {
  const { roots, children } = buildTree(thread.comments);

  return (
    <div className="space-y-4">
      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-sm">{thread.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{thread.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {thread.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="bg-background/30 border-border/70"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {thread.comments.length} contributions · research-grade signal
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                "rounded-md px-2 py-1",
                "hover:bg-accent/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Subscribe (UI only)"
            >
              Subscribe
            </button>
            <button
              type="button"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                "rounded-md px-2 py-1",
                "hover:bg-accent/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Copy thread link (UI only)"
            >
              Copy link
            </button>
          </div>
        </CardContent>
      </Card>

      {roots.length === 0 ? (
        <EmptyDiscussionState />
      ) : (
        <div className="space-y-3">
          {roots.map((c) => (
            <RenderNode
              key={c.id}
              comment={c}
              depth={0}
              childrenMap={children}
            />
          ))}
        </div>
      )}

      {showComposer ? <DiscussionComposer /> : null}
    </div>
  );
}
