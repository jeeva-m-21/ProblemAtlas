import Link from "next/link";

import type { SearchFiltersInput, SearchTabKey } from "@/lib/data/search";
import { SEARCH_DOMAINS } from "@/lib/data/search";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function baseParams({
  tab,
  filters,
}: {
  tab: SearchTabKey;
  filters: SearchFiltersInput;
}) {
  const params = new URLSearchParams();
  if (tab && tab !== "all") params.set("tab", tab);
  for (const domain of filters.domains) params.append("domain", domain);
  if (filters.feasibility) params.set("feasibility", filters.feasibility);
  if (filters.implementationScope) params.set("scope", filters.implementationScope);
  if (filters.activityLevel) params.set("activity", filters.activityLevel);
  if (filters.collaboration) params.set("collaboration", filters.collaboration);
  return params;
}

function hrefWithQuery({
  q,
  tab,
  filters,
}: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFiltersInput;
}) {
  const params = baseParams({ tab, filters });
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function EmptySearchState({
  q,
  tab,
  filters,
}: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFiltersInput;
}) {
  const resetHref = "/search";

  const suggestedQueries = [
    "eval harness",
    "trace schema",
    "reproducible toolchains",
    "citation drift",
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/30 ring-1 ring-foreground/5",
        "supports-[backdrop-filter]:bg-background/25 backdrop-blur-xl"
      )}
    >
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            No matches
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            Nothing surfaced for this slice
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Try a narrower phrase, or loosen filters to re-open the search surface.
            This is a research index—precision beats keywords.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={resetHref}
            className={cn(
              "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            <Badge
              variant="outline"
              className="h-7 px-3 text-[0.8rem] bg-background/35 hover:bg-background/45 border-border/70"
            >
              Reset search
            </Badge>
          </Link>

          {SEARCH_DOMAINS.slice(0, 3).map((d) => (
            <Link
              key={d.value}
              href={hrefWithQuery({ q, tab, filters: { ...filters, domains: [d.value] } })}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Badge
                variant="outline"
                className="h-7 px-3 text-[0.8rem] bg-background/35 hover:bg-background/45 border-border/70"
              >
                {d.label}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground/85">Try</p>
          <div className="flex flex-wrap items-center gap-2">
            {suggestedQueries.map((suggestion) => (
              <Link
                key={suggestion}
                href={hrefWithQuery({ q: suggestion, tab, filters })}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className="h-7 px-3 text-[0.8rem] bg-background/25 hover:bg-background/35 border-border/70"
                >
                  {suggestion}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
