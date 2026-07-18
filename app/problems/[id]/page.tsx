import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";

import { getProblemById } from "@/lib/data/problems";
import { ProblemDetailHeader } from "@/components/problem/ProblemDetailHeader";
import { ProblemDiscussionPreview } from "@/components/problem/ProblemDiscussionPreview";
import { ProblemMetadata } from "@/components/problem/ProblemMetadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const problem = Number.isFinite(id) ? await getProblemById(id) : null;

  if (!problem) {
    return {
      title: "Problem",
      description: "Problem dossier",
    };
  }

  return {
    title: problem.title,
    description: problem.summary,
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

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const problem = await getProblemById(id);
  if (!problem) notFound();

  return (
    <div className="space-y-10">
      <ProblemDetailHeader problem={problem} />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-10">
          <SectionShell eyebrow="Summary" title="Problem summary">
            <Card className="bg-card/55 ring-1 ring-foreground/10">
              <CardContent className="space-y-6 pt-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground/90">
                    Detailed explanation
                  </h3>
                  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {problem.summaryDetail.explanation.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/60" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground/90">
                    Research / system gap
                  </h3>
                  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {problem.summaryDetail.gap.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/60" />

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground/90">
                      Why current systems fail
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {problem.summaryDetail.failureModes.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground/90">
                      Why it matters
                    </h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {problem.summaryDetail.whyItMatters.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SectionShell>

          <SectionShell eyebrow="Gaps" title="Research gaps and constraints">
            <div className="grid gap-4 md:grid-cols-2">
              {problem.researchGaps.map((gap) => (
                <Card
                  key={gap.title}
                  className={cn(
                    "bg-card/55 ring-1 ring-foreground/10",
                    "transition-colors hover:bg-card/60"
                  )}
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-mono text-muted-foreground/85">
                        {gap.kind}
                      </p>
                    </div>
                    <CardTitle className="text-sm">{gap.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {gap.detail}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionShell>

          <SectionShell eyebrow="Directions" title="Possible directions">
            <div className="space-y-4">
              {problem.possibleDirections.map((d) => (
                <Card
                  key={d.title}
                  className={cn(
                    "bg-card/55 ring-1 ring-foreground/10",
                    "transition-colors hover:bg-card/60"
                  )}
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-sm">{d.title}</CardTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {d.summary}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">
                          Opportunities
                        </p>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                          {d.opportunities.map((p) => (
                            <li key={p} className="flex gap-2">
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">
                          Evaluation
                        </p>
                        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                          {d.evaluation.map((p) => (
                            <li key={p} className="flex gap-2">
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {d.risks && d.risks.length > 0 ? (
                      <div className="rounded-xl border border-border/60 bg-background/35 p-3 ring-1 ring-foreground/5">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">
                          Risks
                        </p>
                        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                          {d.risks.map((p) => (
                            <li key={p} className="flex gap-2">
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionShell>

          <SectionShell eyebrow="Discussion" title="Research discussion">
            <ProblemDiscussionPreview
              comments={problem.discussionPreview.comments}
              totalCount={problem.discussionPreview.totalCount}
            />
          </SectionShell>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            <ProblemMetadata problem={problem} />
          </div>
        </aside>
      </div>
    </div>
  );
}
