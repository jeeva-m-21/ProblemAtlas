import Link from "next/link";
import { UserPlus } from "lucide-react";

import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  return (
    <AuthBackground>
      <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-center">
        <AuthCard
          eyebrow="Sign up"
          title="Join the network"
          description="Create a research identity for collaboration and evidence tracking."
          footer={
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/auth/sign-in"
                className={cn(
                  "text-xs text-muted-foreground hover:text-foreground",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "rounded-md px-2 py-1"
                )}
              >
                Already have an account?
              </Link>
              <Link
                href="/onboarding"
                className={cn(
                  "text-xs text-muted-foreground hover:text-foreground",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "rounded-md px-2 py-1"
                )}
              >
                Continue to onboarding
              </Link>
            </div>
          }
        >
          <form method="get" action="/onboarding" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="h-10 bg-background/25 border-border/70"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="role">
                  Role / title
                </label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Systems / Applied Research"
                  className="h-10 bg-background/25 border-border/70"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@lab.org"
                className="h-10 bg-background/25 border-border/70"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a secure passphrase"
                className="h-10 bg-background/25 border-border/70"
                required
              />
            </div>

            <Button className="h-10 w-full" type="submit">
              <UserPlus aria-hidden="true" />
              Create account
            </Button>

            <p className="text-xs leading-relaxed text-muted-foreground">
              UI-only MVP: account creation is not persisted yet.
            </p>
          </form>
        </AuthCard>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Onboarding
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Configure your research surface
            </h1>
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Choose domains and collaboration intent. ProblemAtlas will tune discovery
              and workspace surfaces to the kinds of work you actually do.
            </p>
          </div>

          <div
            className={cn(
              "rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5",
              "supports-[backdrop-filter]:bg-background/15 backdrop-blur-xl"
            )}
          >
            <div className="space-y-3 p-5">
              <p className="text-xs font-mono text-muted-foreground/85">What you get</p>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <span>Signal-ranked global search across problems, spaces, and artifacts.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <span>Intelligence panels: activity, feasibility, collaboration status.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <span>Evidence-first discussion threads tied to workspaces.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
