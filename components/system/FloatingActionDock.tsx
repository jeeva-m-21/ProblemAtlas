"use client";

import Link from "next/link";
import type React from "react";
import { Activity, Command, Layers, Search, Signal } from "lucide-react";

import { cn } from "@/lib/utils";
import { openGlobalCommandBar } from "@/components/system/GlobalCommandBar";

function DockButton({
  label,
  children,
  onClick,
  href,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const classes = cn(
    "inline-flex size-10 items-center justify-center rounded-2xl",
    "border border-border/60 bg-background/35",
    "text-muted-foreground hover:text-foreground hover:bg-background/45",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label} title={label}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export function FloatingActionDock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed right-4 bottom-14 z-40 sm:right-6",
        className
      )}
    >
      <div
        className={cn(
          "rounded-3xl border border-border/60 bg-background/35",
          "supports-[backdrop-filter]:bg-background/25 backdrop-blur-xl",
          "ring-1 ring-foreground/5",
          "p-2",
          "flex items-center gap-2"
        )}
      >
        <DockButton label="Search" href="/search">
          <Search className="size-4" aria-hidden="true" />
        </DockButton>
        <DockButton label="Create problem (placeholder)" href="/explore">
          <Layers className="size-4" aria-hidden="true" />
        </DockButton>
        <DockButton label="Create space (placeholder)" href="/search?tab=spaces">
          <Signal className="size-4" aria-hidden="true" />
        </DockButton>
        <DockButton label="Notifications (activity)" href="/profile/me">
          <Activity className="size-4" aria-hidden="true" />
        </DockButton>
        <DockButton label="Command bar" onClick={() => openGlobalCommandBar()}>
          <Command className="size-4" aria-hidden="true" />
        </DockButton>
      </div>
    </div>
  );
}
