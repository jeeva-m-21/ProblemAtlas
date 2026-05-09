import Link from "next/link";
import { GitBranch, Mail } from "lucide-react";

import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  return (
    <AuthBackground>
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Access
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Enter the research OS
            </h1>
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Sign in to continue where you left off—problems, spaces, artifacts, and
              discussions threaded as a single intelligence surface.
            </p>
          </div>

          <div
            className={cn(
              "rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5",
              "supports-[backdrop-filter]:bg-background/15 backdrop-blur-xl"
            )}
          >
            <div className="space-y-3 p-5">
              <p className="text-xs font-mono text-muted-foreground/85">Session</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-background/25 p-3 ring-1 ring-foreground/10">
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <p className="text-sm font-semibold tracking-tight">High</p>
                </div>
                <div className="rounded-xl bg-background/25 p-3 ring-1 ring-foreground/10">
                  <p className="text-xs text-muted-foreground">Context</p>
                  <p className="text-sm font-semibold tracking-tight">Persisted</p>
                </div>
                <div className="rounded-xl bg-background/25 p-3 ring-1 ring-foreground/10">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="text-sm font-semibold tracking-tight">Building</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Auth is UI-only for the MVP. This flow is a design + navigation
                surface.
              </p>
            </div>
          </div>
        </div>

        <AuthCard
          eyebrow="Sign in"
          title="Continue"
          description="Use email/password or an OAuth placeholder."
          footer={
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/auth/sign-up"
                className={cn(
                  "text-xs text-muted-foreground hover:text-foreground",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "rounded-md px-2 py-1"
                )}
              >
                Create an account
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
                Skip to onboarding
              </Link>
            </div>
          }
        >
          <form method="get" action="/explore" className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@lab.org"
                  className="h-10 pl-10 bg-background/25 border-border/70"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••"
                className="h-10 bg-background/25 border-border/70"
                required
              />
            </div>

            <Button className="h-10 w-full" type="submit">
              Continue
            </Button>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="rounded-full bg-background/15 px-3 py-1 text-[0.7rem] text-muted-foreground ring-1 ring-foreground/10">
                OAuth placeholders
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" className="h-10 w-full" type="button">
              <GitBranch aria-hidden="true" />
              Continue with GitHub
            </Button>
            <Button variant="outline" className="h-10 w-full" type="button">
              Continue with Google
            </Button>
          </div>

          <div className="pt-2">
            <p className="text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to keep discussions technical, evidence-based,
              and respectful.
            </p>
          </div>
        </AuthCard>
      </div>
    </AuthBackground>
  );
}
