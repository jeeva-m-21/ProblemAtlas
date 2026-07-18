import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import {
  DEFAULT_DOMAIN_KEYS,
  mockDomains,
  type DomainKey,
} from "@/lib/data/search";
import {
  DEFAULT_INTERESTS,
  type InterestKey,
} from "@/components/auth/InterestSelection";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { DomainSelector } from "@/components/auth/DomainSelector";
import { InterestSelection } from "@/components/auth/InterestSelection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set up domains and collaboration intent for your research identity.",
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

function isDomainKey(value: string): value is DomainKey {
  return (
    value === "ai-ml" ||
    value === "distributed-systems" ||
    value === "robotics" ||
    value === "physics" ||
    value === "healthcare" ||
    value === "climate" ||
    value === "security" ||
    value === "developer-tools"
  );
}

function isInterestKey(value: string): value is InterestKey {
  return (
    value === "research" ||
    value === "implementation" ||
    value === "prototyping" ||
    value === "architecture" ||
    value === "startup-validation" ||
    value === "systems-design"
  );
}

function parse(raw: RawSearchParams) {
  const selectedDomains = asArray(raw.domain).filter(isDomainKey);
  const selectedInterests = asArray(raw.interest).filter(isInterestKey);

  const domains = selectedDomains.length > 0 ? selectedDomains : DEFAULT_DOMAIN_KEYS;

  const interests =
    selectedInterests.length > 0
      ? selectedInterests
      : [DEFAULT_INTERESTS[0]?.key, DEFAULT_INTERESTS[1]?.key].filter(Boolean);

  const goal = asString(raw.goal).trim();

  return { domains, interests, goal };
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const raw = (await searchParams) ?? {};
  const { domains, interests, goal } = parse(raw);

  return (
    <AuthBackground>
      <div className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                Research identity
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Initialize your signal profile
              </h1>
              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                Select domains and collaboration intent. This shapes discovery surfaces,
                ranking, and the default lens across the knowledge graph.
              </p>
            </div>

            <div
              className={cn(
                "rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5",
                "supports-[backdrop-filter]:bg-background/15 backdrop-blur-xl"
              )}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Step</p>
                  <p className="text-sm font-semibold tracking-tight">1 of 1</p>
                </div>
                <div className="h-8 w-px bg-border/60" />
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="text-sm font-semibold tracking-tight">Calibration</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <section className="space-y-6">
            <form method="get" action="/explore" className="space-y-6">
              <DomainSelector domains={mockDomains} selected={domains} name="domain" />

              <InterestSelection selected={interests} name="interest" />

              <AuthCard
                eyebrow="Collaboration"
                title="What are you optimizing for?"
                description="Optional, but helps shape default prompts and ranking later."
              >
                <textarea
                  name="goal"
                  defaultValue={goal}
                  rows={3}
                  placeholder="e.g. Pair with builders on eval harnesses; ship traceable tooling; prototype systems with evidence-first UX"
                  className={cn(
                    "w-full rounded-xl border border-border/70 bg-background/25 px-3 py-2 text-sm",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    This is UI-only for now; values are not persisted.
                  </p>
                  <Button className="h-10 sm:w-auto" type="submit">
                    Continue
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </AuthCard>
            </form>
          </section>

          <aside className="space-y-4">
            <AuthCard
              eyebrow="Preview"
              title="How this changes the UI"
              description="Your selections tune the default lens across pages."
            >
              <div className="space-y-3">
                <div className="rounded-xl bg-background/25 p-3 ring-1 ring-foreground/10">
                  <p className="text-xs font-mono text-muted-foreground/85">Discovery</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Domain-scoped search surfaces with signal-weighted ranking.
                  </p>
                </div>
                <div className="rounded-xl bg-background/25 p-3 ring-1 ring-foreground/10">
                  <p className="text-xs font-mono text-muted-foreground/85">Workspaces</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Default artifact types and discussions bias toward your intent.
                  </p>
                </div>
                <div className="rounded-xl bg-background/25 p-3 ring-1 ring-foreground/10">
                  <p className="text-xs font-mono text-muted-foreground/85">Identity</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Profile highlights shift: research vs implementation vs systems.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Want to skip? You can always configure later.
                </p>
                <div className="pt-2">
                  <Link
                    href="/explore"
                    className={cn(
                      "text-xs text-muted-foreground hover:text-foreground",
                      "transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      "rounded-md px-2 py-1"
                    )}
                  >
                    Continue without onboarding
                  </Link>
                </div>
              </div>
            </AuthCard>
          </aside>
        </div>
      </div>
    </AuthBackground>
  );
}
