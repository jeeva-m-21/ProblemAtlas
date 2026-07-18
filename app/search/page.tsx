import type { Metadata } from "next";

import {
  searchAll,
  type ActivityLevel,
  type CollaborationStatus,
  type SearchFilters,
  type SearchTabKey,
} from "@/lib/data/search";
import type { ImplementationScope, ProblemDomain } from "@/lib/data/problems";
import { GlobalSearchBar } from "@/components/search/GlobalSearchBar";
import { SearchTabs } from "@/components/search/SearchTabs";
import { SearchFilters as FiltersPanel } from "@/components/search/SearchFilters";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { EmptySearchState } from "@/components/search/EmptySearchState";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Global discovery across problems, spaces, researchers, artifacts, and discussions.",
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function asString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function asArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function isTabKey(value: string): value is SearchTabKey {
  return (
    value === "all" ||
    value === "problems" ||
    value === "spaces" ||
    value === "researchers" ||
    value === "artifacts" ||
    value === "discussions"
  );
}

function isDomain(value: string): value is ProblemDomain {
  return (
    value === "AI/ML" ||
    value === "DevTools & Systems" ||
    value === "Physics" ||
    value === "Healthcare" ||
    value === "Robotics"
  );
}

function isImplementationScope(value: string): value is ImplementationScope {
  return value === "small" || value === "medium" || value === "large";
}

function isActivityLevel(value: string): value is ActivityLevel {
  return value === "low" || value === "medium" || value === "high";
}

function isCollaboration(value: string): value is CollaborationStatus {
  return value === "solo" || value === "open" || value === "active";
}

function isFeasibility(value: string): value is NonNullable<SearchFilters["feasibility"]> {
  return value === "low" || value === "medium" || value === "high";
}

function parseSearchParams(raw: RawSearchParams) {
  const q = asString(raw.q).trim();

  const tabRaw = asString(raw.tab).trim();
  const tab: SearchTabKey = tabRaw && isTabKey(tabRaw) ? tabRaw : "all";

  const domains = asArray(raw.domain).filter(isDomain);

  const feasibilityRaw = asString(raw.feasibility).trim();
  const feasibility = feasibilityRaw && isFeasibility(feasibilityRaw) ? feasibilityRaw : undefined;

  const scopeRaw = asString(raw.scope).trim();
  const implementationScope = scopeRaw && isImplementationScope(scopeRaw) ? scopeRaw : undefined;

  const activityRaw = asString(raw.activity).trim();
  const activityLevel = activityRaw && isActivityLevel(activityRaw) ? activityRaw : undefined;

  const collaborationRaw = asString(raw.collaboration).trim();
  const collaboration = collaborationRaw && isCollaboration(collaborationRaw) ? collaborationRaw : undefined;

  const filters = {
    domains,
    feasibility,
    implementationScope,
    activityLevel,
    collaboration,
  };

  return { q, tab, filters };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const raw = (await searchParams) ?? {};
  const { q, tab, filters } = parseSearchParams(raw);

  const results = await searchAll({ q, tab, ...filters });

  return (
    <div className="space-y-8">
      <GlobalSearchBar query={q} tab={tab} filters={filters} />

      <div className="space-y-4">
        <SearchTabs q={q} tab={tab} filters={filters} />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
          <FiltersPanel q={q} tab={tab} filters={filters} />

          <section className="space-y-4">
            <header
              className={cn(
                "rounded-2xl border border-border/60 bg-background/25 ring-1 ring-foreground/5",
                "supports-[backdrop-filter]:bg-background/20 backdrop-blur-xl"
              )}
            >
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    Results
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground/85">{results.length}</span>{" "}
                    matches
                    {q ? (
                      <>
                        {" "}for{" "}
                        <span className="font-mono text-foreground/75">“{q}”</span>
                      </>
                    ) : null}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  tab: {tab}
                </p>
              </div>
            </header>

            {results.length === 0 ? (
              <EmptySearchState q={q} tab={tab} filters={filters} />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
                  >
                    <SearchResultCard result={result} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
