import type React from "react";
import { Search, Sparkles } from "lucide-react";

import type { SearchFilters, SearchTabKey } from "@/data/mockSearchResults";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function hiddenInputs(filters: SearchFilters) {
  const nodes: React.ReactNode[] = [];

  for (const domain of filters.domains) {
    nodes.push(
      <input key={`domain-${domain}`} type="hidden" name="domain" value={domain} />
    );
  }

  if (filters.feasibility) {
    nodes.push(
      <input
        key="feasibility"
        type="hidden"
        name="feasibility"
        value={filters.feasibility}
      />
    );
  }

  if (filters.implementationScope) {
    nodes.push(
      <input
        key="scope"
        type="hidden"
        name="scope"
        value={filters.implementationScope}
      />
    );
  }

  if (filters.activityLevel) {
    nodes.push(
      <input
        key="activity"
        type="hidden"
        name="activity"
        value={filters.activityLevel}
      />
    );
  }

  if (filters.collaboration) {
    nodes.push(
      <input
        key="collaboration"
        type="hidden"
        name="collaboration"
        value={filters.collaboration}
      />
    );
  }

  return nodes;
}

export function GlobalSearchBar({
  query,
  tab,
  filters,
  className,
}: {
  query: string;
  tab: SearchTabKey;
  filters: SearchFilters;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-background/40 ring-1 ring-foreground/5",
        "supports-[backdrop-filter]:bg-background/35 backdrop-blur-xl",
        "overflow-hidden",
        className
      )}
    >
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl" />
          <div className="absolute -bottom-14 right-[-80px] h-48 w-48 rounded-full bg-foreground/4 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--foreground)/0.10),transparent_55%)]" />
        </div>

        <div className="relative space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                Global Discovery
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Search the research graph
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Problems, solution spaces, researchers, artifacts, and discussions—ranked
                by activity and evidence density.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-background/35 px-3 py-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="font-mono">signal-first</span>
            </div>
          </div>

          <form method="get" action="/search" className="space-y-3">
            <input type="hidden" name="tab" value={tab} />
            {hiddenInputs(filters)}

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search intelligence: eval harnesses, trace schemas, reproducible toolchains…"
                className={cn(
                  "h-12 rounded-xl pl-11 pr-4",
                  "bg-background/25 border-border/70",
                  "focus-visible:ring-ring/50 focus-visible:border-ring"
                )}
                aria-label="Global search"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Tip: use short noun phrases; filters stay in-context.
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                GET /search?q=…
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
