import { cn } from "@/lib/utils";

export type InterestKey =
  | "research"
  | "implementation"
  | "prototyping"
  | "architecture"
  | "startup-validation"
  | "systems-design";

export type Interest = {
  key: InterestKey;
  label: string;
  description: string;
};

export const DEFAULT_INTERESTS: Interest[] = [
  {
    key: "research",
    label: "Research",
    description: "Metrics, hypotheses, evaluation harnesses, and evidence collection.",
  },
  {
    key: "implementation",
    label: "Implementation",
    description: "Shipping systems: code quality, constraints, and operational reality.",
  },
  {
    key: "prototyping",
    label: "Prototyping",
    description: "Fast experiments to de-risk ideas and validate feasibility early.",
  },
  {
    key: "architecture",
    label: "Architecture",
    description: "Interfaces, invariants, and scalable design patterns.",
  },
  {
    key: "startup-validation",
    label: "Startup validation",
    description: "Problem selection, user discovery, and value/market clarity.",
  },
  {
    key: "systems-design",
    label: "Systems design",
    description: "Latency, reliability, data flow, and failure-mode reasoning.",
  },
];

function InterestChip({
  interest,
  selected,
  name,
}: {
  interest: Interest;
  selected: boolean;
  name: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer select-none items-start gap-3 rounded-2xl p-3",
        "border border-border/60 bg-background/20 ring-1 ring-foreground/5",
        "transition-colors",
        "hover:bg-background/28",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        selected ? "bg-accent/15 border-border/70" : ""
      )}
    >
      <input
        type="checkbox"
        name={name}
        value={interest.key}
        defaultChecked={selected}
        className="sr-only"
      />

      <div className="mt-0.5 flex size-8 items-center justify-center rounded-xl bg-background/35 ring-1 ring-foreground/10">
        <span
          className={cn(
            "h-1.5 w-4 rounded-full",
            selected ? "bg-foreground/70" : "bg-foreground/25"
          )}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold tracking-tight text-foreground/95">
          {interest.label}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {interest.description}
        </p>
      </div>
    </label>
  );
}

export function InterestSelection({
  interests = DEFAULT_INTERESTS,
  selected,
  name = "interest",
  className,
}: {
  interests?: Interest[];
  selected: InterestKey[];
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            Interests
          </p>
          <p className="text-sm font-semibold tracking-tight">Choose how you collaborate</p>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          {selected.length} selected
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {interests.map((interest) => (
          <div
            key={interest.key}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
          >
            <InterestChip
              interest={interest}
              selected={selected.includes(interest.key)}
              name={name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
