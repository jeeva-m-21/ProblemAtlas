import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DiscussionComment } from "@/data/mockDiscussions";

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

export function CommentCard({
  comment,
  depth = 0,
  tone = "default",
}: {
  comment: DiscussionComment;
  depth?: number;
  tone?: "default" | "reply";
}) {
  const indent = Math.min(depth, 3) * 18;

  return (
    <article
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-1 duration-500",
        "rounded-2xl border border-border/60",
        "bg-card/55 ring-1 ring-foreground/10",
        "shadow-[0_1px_0_0_oklch(from_var(--foreground)_l_c_h_/_0.03)]",
        "transition-colors",
        "hover:bg-card/60",
        tone === "reply" && "bg-background/35"
      )}
      style={{ marginLeft: indent }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <InitialAvatar initials={comment.author.initials} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground/90">
                  {comment.author.name}
                </p>
                <span className="text-muted-foreground/40">•</span>
                <p className="text-xs font-mono text-muted-foreground/85">
                  {comment.author.role}
                </p>
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {comment.createdAt}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                "rounded-md px-2 py-1",
                "hover:bg-accent/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Reply (UI only)"
            >
              Reply
            </button>
            <button
              type="button"
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                "rounded-md px-2 py-1",
                "hover:bg-accent/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Copy link (UI only)"
            >
              Copy link
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {comment.body.split("\n\n").map((paragraph) => (
            <p key={paragraph} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        {comment.tags && comment.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
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
    </article>
  );
}
