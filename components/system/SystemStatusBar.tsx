"use client";

import * as React from "react";
import { Activity, Command, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const OPEN_EVENT = "problematlas:commandbar:open";

export function SystemStatusBar({ className }: { className?: string }) {
  const [pulse, setPulse] = React.useState(false);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 220);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  function openCommandBar() {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40",
        "border-t border-border/50",
        "bg-background/50 supports-[backdrop-filter]:bg-background/35 backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-11 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline font-mono">system</span>
            <span className="hidden sm:inline text-muted-foreground/60">·</span>
            <span className="inline-flex items-center gap-2">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  pulse ? "bg-foreground/50" : "bg-foreground/25"
                )}
                aria-hidden="true"
              />
              <span className="font-mono">synced</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCommandBar}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                "border border-border/60 bg-background/25",
                "text-xs text-muted-foreground hover:text-foreground hover:bg-background/35",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              aria-label="Open command bar"
            >
              <Command className="size-3.5" aria-hidden="true" />
              <span className="font-mono">Ctrl/⌘ K</span>
            </button>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-background/20 px-3 py-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              <span className="font-mono">collab</span>
              <span className="text-foreground/70">3</span>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-background/20 px-3 py-1.5 text-xs text-muted-foreground">
              <Activity className="size-3.5" aria-hidden="true" />
              <span className="font-mono">activity</span>
              <span className="text-foreground/70">medium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
