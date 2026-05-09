import type { ProblemDetail } from "@/data/mockProblemDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      <p className="text-xs leading-relaxed text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

function InitialBadge({
  initials,
  status,
  name,
}: {
  initials: string;
  status: "active" | "idle";
  name: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex size-9 items-center justify-center rounded-full",
        "bg-background/35 ring-1 ring-foreground/10",
        "text-xs font-medium text-foreground/85",
        "transition-colors",
        "hover:bg-background/55"
      )}
      title={name}
      aria-label={name}
    >
      {initials}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background",
          status === "active"
            ? "bg-[oklch(from_var(--foreground)_l_c_h_/_0.45)]"
            : "bg-[oklch(from_var(--foreground)_l_c_h_/_0.18)]"
        )}
      />
    </div>
  );
}

export function ProblemMetadata({ problem }: { problem: ProblemDetail }) {
  return (
    <div className="space-y-4">
      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Actions</CardTitle>
          <p className="text-xs text-muted-foreground">
            UI-only controls for MVP.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" aria-label="Start a solution space (UI only)">
            Start solution space
          </Button>
          <Button
            variant="outline"
            className="w-full"
            aria-label="Follow problem (UI only)"
          >
            Follow
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            aria-label="Add a research note (UI only)"
          >
            Add note
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Signals</CardTitle>
          <p className="text-xs text-muted-foreground">
            Operational readout for feasibility and execution risk.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Meter
            label="Feasibility"
            value={problem.feasibilityScore}
            hint="How tractable this is with current methods and resources."
          />
          <div className="h-px bg-border/60" />
          <Meter
            label="Implementation difficulty"
            value={problem.implementationDifficulty}
            hint="Engineering complexity, integration cost, and unknowns."
          />
        </CardContent>
      </Card>

      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Collaborators</CardTitle>
          <p className="text-xs text-muted-foreground">
            Active researchers and builders following this thread.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {problem.collaborators.map((c) => (
              <InitialBadge
                key={c.name}
                initials={c.initials}
                status={c.status}
                name={c.name}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {problem.interestedCount} interested
            </span>
            <span>
              {problem.activeSolutionSpacesCount} active spaces
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Related domains</CardTitle>
          <p className="text-xs text-muted-foreground">
            Adjacent areas likely to share tooling and evaluation.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {problem.relatedDomains.map((d) => (
            <Badge
              key={d}
              variant="outline"
              className="h-7 px-3 text-[0.8rem] bg-background/35 border-border/70"
            >
              {d}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
