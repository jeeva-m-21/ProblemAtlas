import { Search } from "lucide-react";
import Link from "next/link";

import { getProblems, type ProblemDomain } from "@/lib/data/problems";
import type { ImplementationScope } from "@/lib/data/problems";
import { ProblemCard } from "@/components/problem/ProblemCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const domains: { label: string; value: ProblemDomain }[] = [
  { label: "AI/ML", value: "AI/ML" },
  { label: "DevTools & Systems", value: "DevTools & Systems" },
  { label: "Physics", value: "Physics" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Robotics", value: "Robotics" },
];

type RawSearchParams = Record<string, string | string[] | undefined>;

function asString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function isDomain(value: string): value is ProblemDomain {
  return domains.some((d) => d.value === value);
}

type ExploreTab = "all" | "needs-help";
type ExploreSort = "signal" | "impact" | "urgency" | "feasibility";

function isTab(value: string): value is ExploreTab {
  return value === "all" || value === "needs-help";
}

function isSort(value: string): value is ExploreSort {
  return (
    value === "signal" ||
    value === "impact" ||
    value === "urgency" ||
    value === "feasibility"
  );
}

function demandScore(interestedCount: number): 1 | 2 | 3 | 4 | 5 {
  if (interestedCount >= 55) return 5;
  if (interestedCount >= 45) return 4;
  if (interestedCount >= 30) return 3;
  if (interestedCount >= 18) return 2;
  return 1;
}

function urgencyScore({
  interestedCount,
  activeSolutionSpacesCount,
}: {
  interestedCount: number;
  activeSolutionSpacesCount: number;
}) {
  const demand = demandScore(interestedCount);
  const supply = Math.min(5, Math.max(0, activeSolutionSpacesCount));
  return demand - supply;
}

function needsHelp(problem: {
  interestedCount: number;
  activeSolutionSpacesCount: number;
  implementationScope: ImplementationScope;
}) {
  const gap = urgencyScore(problem);
  if (gap >= 3) return true;
  if (problem.activeSolutionSpacesCount === 0 && problem.implementationScope === "large") return true;
  return false;
}

function buildQuery(params: URLSearchParams, updates: Record<string, string | null>) {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(updates)) {
    if (!value) next.delete(key);
    else next.set(key, value);
  }
  const query = next.toString();
  return query ? `?${query}` : "";
}

function FilterPill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-7 px-3 text-[0.8rem]",
        active
          ? "bg-accent/25 border-border/80 text-foreground"
          : "bg-background/40 hover:bg-background/55 border-border/70"
      )}
    >
      {label}
    </Badge>
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const raw = (await searchParams) ?? {};
  const q = asString(raw.q).trim();

  const domainRaw = asString(raw.domain).trim();
  const domain = isDomain(domainRaw) ? domainRaw : undefined;

  const tabRaw = asString(raw.tab).trim();
  const tab: ExploreTab = isTab(tabRaw) ? tabRaw : "all";

  const sortRaw = asString(raw.sort).trim();
  const sort: ExploreSort = isSort(sortRaw) ? sortRaw : "signal";

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (domain) params.set("domain", domain);
  if (tab !== "all") params.set("tab", tab);
  if (sort !== "signal") params.set("sort", sort);

  const allProblems = await getProblems({ domain, search: q || undefined });

  const filtered = allProblems
    .filter((p) => {
      if (tab === "needs-help" && !needsHelp(p)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "impact") return b.interestedCount - a.interestedCount;
      if (sort === "feasibility") return b.feasibilityScore - a.feasibilityScore;
      if (sort === "urgency") return urgencyScore(b) - urgencyScore(a);
      return (
        b.interestedCount + b.activeSolutionSpacesCount * 10 -
        (a.interestedCount + a.activeSolutionSpacesCount * 10)
      );
    });

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground/85">
            Explore
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Problems
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Scan problems as decision surfaces: impact, urgency, feasibility, and collaboration demand.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/55 ring-1 ring-foreground/5">
          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <form method="get" className="flex w-full flex-col gap-3 lg:max-w-2xl lg:flex-row lg:items-center">
                <div className="relative w-full">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    name="q"
                    defaultValue={q}
                    placeholder="Search title + summary"
                    className="h-10 pl-10 bg-background/35 border-border/70"
                    aria-label="Search problems"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort"
                    className="text-xs font-mono text-muted-foreground/85"
                  >
                    sort
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    defaultValue={sort}
                    className={cn(
                      "h-10 rounded-xl border border-border/70 bg-background/35 px-3 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    )}
                  >
                    <option value="signal">Signal</option>
                    <option value="impact">Impact</option>
                    <option value="urgency">Urgency</option>
                    <option value="feasibility">Feasibility</option>
                  </select>
                </div>

                {domain ? <input type="hidden" name="domain" value={domain} /> : null}
                {tab !== "all" ? <input type="hidden" name="tab" value={tab} /> : null}

                <button
                  type="submit"
                  className={cn(
                    "h-10 shrink-0 rounded-xl px-4 text-sm",
                    "border border-border/70 bg-background/35",
                    "text-muted-foreground hover:text-foreground hover:bg-background/45",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                >
                  Apply
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={buildQuery(params, { domain: null })}
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Filter domain: All"
                >
                  <FilterPill label="All" active={!domain} />
                </Link>
                {domains.map((d) => (
                  <Link
                    key={d.value}
                    href={buildQuery(params, { domain: d.value })}
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Filter domain: ${d.label}`}
                  >
                    <FilterPill label={d.label} active={domain === d.value} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
              <div className="flex items-center gap-2">
                {(
                  [
                    { key: "all", label: "All" },
                    { key: "needs-help", label: "Needs help" },
                  ] as const
                ).map((t) => {
                  const active = tab === t.key;
                  return (
                    <Link
                      key={t.key}
                      href={buildQuery(params, { tab: t.key === "all" ? null : t.key })}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium",
                        "border",
                        active
                          ? "bg-accent/25 border-border/80 text-foreground"
                          : "bg-background/30 border-border/60 text-muted-foreground hover:text-foreground hover:bg-background/40",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground/80">{filtered.length}</span> of {allProblems.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-background/40 p-6 ring-1 ring-foreground/5">
            <p className="text-sm font-medium tracking-tight">No matches</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try removing filters or broadening your search query.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
