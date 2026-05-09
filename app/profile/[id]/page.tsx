import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContributionActivity } from "@/components/profile/ContributionActivity";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileProblemCard } from "@/components/profile/ProfileProblemCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ResearchInterests } from "@/components/profile/ResearchInterests";
import { getMockProblemById, getMockProfile } from "@/data/mockProfiles";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = getMockProfile(id);

  if (!profile) {
    return { title: "Profile", description: "Research identity" };
  }

  return {
    title: profile.name,
    description: profile.bio,
  };
}

function SectionShell({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-700",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground/85">{eyebrow}</p>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getMockProfile(id);
  if (!profile) notFound();

  const contributed = profile.contributedProblems
    .map((c) => {
      const problem = getMockProblemById(c.problemId);
      return problem ? { problem, contribution: c } : undefined;
    })
    .filter(Boolean);

  return (
    <div className="space-y-10">
      <ProfileHeader profile={profile} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-10">
          <ProfileStats profile={profile} />

          <ResearchInterests profile={profile} />

          <ContributionActivity events={profile.activity} />

          <SectionShell eyebrow="Contributions" title="Contributed problems">
            <div className="grid gap-4 md:grid-cols-2">
              {contributed.map((item) => (
                <ProfileProblemCard
                  key={item!.problem.id}
                  problem={item!.problem}
                  contribution={item!.contribution}
                />
              ))}
            </div>
          </SectionShell>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            <div className="rounded-2xl border border-border/60 bg-background/40 ring-1 ring-foreground/5 p-4 sm:p-5">
              <p className="text-xs font-mono text-muted-foreground/85">Readout</p>
              <p className="mt-1 text-sm text-foreground/90">
                Collaboration is measured in artifacts, critique quality, and sustained throughput.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                UI-only MVP. Authentication and persistence will wire later.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/40 ring-1 ring-foreground/5 p-4 sm:p-5">
              <p className="text-xs font-mono text-muted-foreground/85">Status</p>
              <div className="mt-2 space-y-2">
                {(
                  [
                    ["Tempo", profile.collaboration.indicator],
                    ["Last active", profile.collaboration.lastActiveAt],
                    ["Collaborators", String(profile.collaboration.collaborators)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="text-xs font-mono text-muted-foreground/85">
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
