import { cn } from "@/lib/utils";

import type { Domain, DomainKey } from "@/data/mockDomains";

function DomainPill({
  domain,
  selected,
  name,
}: {
  domain: Domain;
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
        value={domain.key}
        defaultChecked={selected}
        className="sr-only"
      />

      <div className="mt-0.5 flex size-8 items-center justify-center rounded-xl bg-background/35 ring-1 ring-foreground/10">
        <span
          className={cn(
            "size-2.5 rounded-full",
            selected ? "bg-foreground/70" : "bg-foreground/25"
          )}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold tracking-tight text-foreground/95">
            {domain.label}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {domain.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {domain.signals.slice(0, 2).map((s) => (
            <span
              key={`${domain.key}-${s.label}`}
              className="rounded-full bg-background/25 px-3 py-1 text-xs text-muted-foreground ring-1 ring-foreground/10"
            >
              <span className="font-mono text-foreground/70">{s.label}</span>{" "}
              <span className="text-muted-foreground">{s.value}</span>
            </span>
          ))}
        </div>
      </div>
    </label>
  );
}

export function DomainSelector({
  domains,
  selected,
  name = "domain",
  className,
}: {
  domains: Domain[];
  selected: DomainKey[];
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            Domains
          </p>
          <p className="text-sm font-semibold tracking-tight">Select your primary signal</p>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          {selected.length} selected
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {domains.map((domain) => (
          <div
            key={domain.key}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
          >
            <DomainPill
              domain={domain}
              selected={selected.includes(domain.key)}
              name={name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
