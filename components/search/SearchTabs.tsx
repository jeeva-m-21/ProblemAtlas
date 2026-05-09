import Link from "next/link";

import type { SearchFilters, SearchTabKey } from "@/data/mockSearchResults";
import { SEARCH_TABS } from "@/data/mockSearchResults";
import { cn } from "@/lib/utils";

function toParams({
  q,
  tab,
  filters,
}: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFilters;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (tab && tab !== "all") params.set("tab", tab);

  for (const domain of filters.domains) params.append("domain", domain);
  if (filters.feasibility) params.set("feasibility", filters.feasibility);
  if (filters.implementationScope) params.set("scope", filters.implementationScope);
  if (filters.activityLevel) params.set("activity", filters.activityLevel);
  if (filters.collaboration) params.set("collaboration", filters.collaboration);

  return params;
}

function buildHref(next: { q: string; tab: SearchTabKey; filters: SearchFilters }) {
  const params = toParams(next);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function SearchTabs({
  q,
  tab,
  filters,
}: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFilters;
}) {
  return (
    <nav
      aria-label="Search categories"
      className={cn(
        "rounded-2xl border border-border/60 bg-background/35 ring-1 ring-foreground/5",
        "supports-[backdrop-filter]:bg-background/30 backdrop-blur-xl"
      )}
    >
      <div className="flex flex-wrap items-center gap-1 p-2">
        {SEARCH_TABS.map((item) => {
          const isActive = item.key === tab;
          const href = buildHref({ q, tab: item.key, filters });

          return (
            <Link
              key={item.key}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative rounded-xl px-3 py-2 text-sm",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "text-foreground bg-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
              )}
            >
              <span className="font-medium tracking-tight">{item.label}</span>
              {isActive ? (
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px bg-foreground/25" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
