import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyDiscussionState({
  title = "No discussion yet",
  description = "Start a high-signal thread: outline assumptions, propose an approach, or flag a failure mode.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="bg-card/55 ring-1 ring-foreground/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Suggested first notes: metrics, risks, evaluation gates.
        </p>
        <Button
          variant="outline"
          className="bg-background/30 border-border/70"
          aria-label="Start discussion (UI only)"
        >
          Start thread
        </Button>
      </CardContent>
    </Card>
  );
}
