import type React from "react";
import Link from "next/link";

import type { ProblemDomain } from "@/lib/data/problems";
import type {
  SearchFiltersInput as SearchFiltersModel,
  SearchTabKey,
} from "@/lib/data/search";
import {
  ACTIVITY_LEVELS,
  COLLABORATION_STATUSES,
  FEASIBILITY_LEVELS,
  IMPLEMENTATION_SCOPES,
  SEARCH_DOMAINS,
} from "@/lib/data/search";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function buildParams({
  q,
  tab,
  filters,
}: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFiltersModel;
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

function hrefFor(next: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFiltersModel;
}) {
  const params = buildParams(next);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

function toggleDomain(
  current: SearchFiltersModel,
  domain: ProblemDomain
): SearchFiltersModel {
  const domains = current.domains.includes(domain)
    ? current.domains.filter((d) => d !== domain)
    : [...current.domains, domain];
  return { ...current, domains };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-mono text-muted-foreground/85">{title}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function SearchFilters({
  q,
  tab,
  filters,
}: {
  q: string;
  tab: SearchTabKey;
  filters: SearchFiltersModel;
}) {
  const hasAnyFilter =
    filters.domains.length > 0 ||
    Boolean(filters.feasibility) ||
    Boolean(filters.implementationScope) ||
    Boolean(filters.activityLevel) ||
    Boolean(filters.collaboration);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/60 bg-background/30 ring-1 ring-foreground/5",
        "supports-[backdrop-filter]:bg-background/25 backdrop-blur-xl"
      )}
    >
      <div className="space-y-5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Filters
            </p>
            <p className="text-sm font-semibold tracking-tight">
              Tighten the signal
            </p>
          </div>

          {hasAnyFilter ? (
            <Link
              href={hrefFor({
                q,
                tab,
                filters: { domains: [] },
              })}
              className={cn(
                "text-xs text-muted-foreground hover:text-foreground",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "rounded-md px-2 py-1"
              )}
            >
              Reset
            </Link>
          ) : null}
        </div>

        <Section title="Domains">
          {SEARCH_DOMAINS.map((d) => {
            const active = filters.domains.includes(d.value);
            const nextFilters = toggleDomain(filters, d.value);

            return (
              <Link
                key={d.value}
                href={hrefFor({ q, tab, filters: nextFilters })}
                aria-pressed={active}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem]",
                    "border-border/70",
                    active
                      ? "bg-accent/30 text-foreground"
                      : "bg-background/35 hover:bg-background/45"
                  )}
                >
                  {d.label}
                </Badge>
              </Link>
            );
          })}
        </Section>

        <Section title="Feasibility">
          {FEASIBILITY_LEVELS.map((f) => {
            const active = filters.feasibility === f.value;
            const nextFilters: SearchFiltersModel = {
              ...filters,
              feasibility: active ? undefined : f.value,
            };

            return (
              <Link
                key={f.value}
                href={hrefFor({ q, tab, filters: nextFilters })}
                aria-pressed={active}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem]",
                    "border-border/70",
                    active
                      ? "bg-accent/30 text-foreground"
                      : "bg-background/35 hover:bg-background/45"
                  )}
                >
                  {f.label}
                </Badge>
              </Link>
            );
          })}
        </Section>

        <Section title="Implementation scope">
          {IMPLEMENTATION_SCOPES.map((s) => {
            const active = filters.implementationScope === s.value;
            const nextFilters: SearchFiltersModel = {
              ...filters,
              implementationScope: active ? undefined : s.value,
            };

            return (
              <Link
                key={s.value}
                href={hrefFor({ q, tab, filters: nextFilters })}
                aria-pressed={active}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem]",
                    "border-border/70",
                    active
                      ? "bg-accent/30 text-foreground"
                      : "bg-background/35 hover:bg-background/45"
                  )}
                >
                  {s.label}
                </Badge>
              </Link>
            );
          })}
        </Section>

        <Section title="Activity">
          {ACTIVITY_LEVELS.map((a) => {
            const active = filters.activityLevel === a.value;
            const nextFilters: SearchFiltersModel = {
              ...filters,
              activityLevel: active ? undefined : a.value,
            };

            return (
              <Link
                key={a.value}
                href={hrefFor({ q, tab, filters: nextFilters })}
                aria-pressed={active}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem]",
                    "border-border/70",
                    active
                      ? "bg-accent/30 text-foreground"
                      : "bg-background/35 hover:bg-background/45"
                  )}
                >
                  {a.label}
                </Badge>
              </Link>
            );
          })}
        </Section>

        <Section title="Collaboration">
          {COLLABORATION_STATUSES.map((c) => {
            const active = filters.collaboration === c.value;
            const nextFilters: SearchFiltersModel = {
              ...filters,
              collaboration: active ? undefined : c.value,
            };

            return (
              <Link
                key={c.value}
                href={hrefFor({ q, tab, filters: nextFilters })}
                aria-pressed={active}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem]",
                    "border-border/70",
                    active
                      ? "bg-accent/30 text-foreground"
                      : "bg-background/35 hover:bg-background/45"
                  )}
                >
                  {c.label}
                </Badge>
              </Link>
            );
          })}
        </Section>

        <div className="pt-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Filters apply across the discovery graph. Feasibility/scope only affect
            problem results.
          </p>
        </div>
      </div>
    </aside>
  );
}
