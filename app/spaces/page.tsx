import Link from "next/link";
import { Search } from "lucide-react";

import { getSolutionSpaces } from "@/lib/data/spaces";
import type { SolutionSpaceRecord as SolutionSpace } from "@/lib/data/spaces";
import { SolutionSpaceCard } from "@/components/space/SolutionSpaceCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RawSearchParams = Record<string, string | string[] | undefined>;

function asString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

type StageFilter = "all" | "exploring" | "validating" | "building" | "stalled" | "published";

type SpacesSort = "activity" | "contributors" | "confidence";

function isStage(value: string): value is StageFilter {
  return (
    value === "all" ||
    value === "exploring" ||
    value === "validating" ||
    value === "building" ||
    value === "stalled" ||
    value === "published"
  );
}

function isSort(value: string): value is SpacesSort {
  return value === "activity" || value === "contributors" || value === "confidence";
}

function daysSince(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return Number.POSITIVE_INFINITY;
  const deltaMs = Date.now() - d.getTime();
  return Math.floor(deltaMs / (1000 * 60 * 60 * 24));
}

function deriveStage(space: SolutionSpace) {
  const quietLong = space.activity.indicator === "Quiet" && daysSince(space.activity.lastActiveAt) >= 35;
  if (quietLong) return "stalled";

  if (space.progressState === "Shipping") return "published";
  if (space.progressState === "Prototyping") return "building";
  if (space.progressState === "Validating") return "validating";
  return "exploring";
}

function activityRank(indicator: SolutionSpace["activity"]["indicator"]) {
  if (indicator === "High") return 3;
  if (indicator === "Active") return 2;
  return 1;
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

function StagePill({ label, active }: { label: string; active: boolean }) {
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

export default async function SpacesPage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const raw = (await searchParams) ?? {};

  const q = asString(raw.q).trim();
  const stageRaw = asString(raw.stage).trim();
  const stage: StageFilter = isStage(stageRaw) ? stageRaw : "all";

  const sortRaw = asString(raw.sort).trim();
  const sort: SpacesSort = isSort(sortRaw) ? sortRaw : "activity";

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (stage !== "all") params.set("stage", stage);
  if (sort !== "activity") params.set("sort", sort);

  const allSpaces = await getSolutionSpaces();

  const filtered = allSpaces
    .filter((s) => {
      if (stage !== "all" && deriveStage(s) !== stage) return false;
      if (!q) return true;
      const haystack = `${s.title} ${s.problemTitle} ${s.overview.direction}`.toLowerCase();
      return haystack.includes(q.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === "contributors") {
        return b.sidebar.collaborationStats.contributors - a.sidebar.collaborationStats.contributors;
      }
      if (sort === "confidence") {
        return b.sidebar.researchConfidence - a.sidebar.researchConfidence;
      }

      // activity
      const r = activityRank(b.activity.indicator) - activityRank(a.activity.indicator);
      if (r !== 0) return r;
      return b.activity.lastActiveAt.localeCompare(a.activity.lastActiveAt);
    });

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted-foreground/85">Spaces</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Solution spaces
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Workspaces where problems become artifacts, tasks, and collaboration. Sort by activity to find where help is needed.
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
                    placeholder="Search spaces, problems, direction"
                    className="h-10 pl-10 bg-background/35 border-border/70"
                    aria-label="Search solution spaces"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-xs font-mono text-muted-foreground/85">
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
                    <option value="activity">Activity</option>
                    <option value="contributors">Contributors</option>
                    <option value="confidence">Confidence</option>
                  </select>
                </div>

                {stage !== "all" ? <input type="hidden" name="stage" value={stage} /> : null}

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
                {(
                  [
                    { key: "all", label: "All" },
                    { key: "exploring", label: "Exploring" },
                    { key: "validating", label: "Validating" },
                    { key: "building", label: "Building" },
                    { key: "stalled", label: "Stalled" },
                    { key: "published", label: "Published" },
                  ] as const
                ).map((t) => (
                  <Link
                    key={t.key}
                    href={buildQuery(params, { stage: t.key === "all" ? null : t.key })}
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Filter stage: ${t.label}`}
                  >
                    <StagePill label={t.label} active={stage === t.key} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-3">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground/80">{filtered.length}</span> of {allSpaces.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Tip: open a space to see tasks + artifacts.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((space) => (
            <SolutionSpaceCard key={space.id} space={space} />
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
