import type React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EmptyStateAction = {
  label: string;
  href: string;
  kind?: "primary" | "secondary";
};

export function EmptyState({
  eyebrow = "No data",
  title,
  description,
  hints,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  hints?: string[];
  actions?: EmptyStateAction[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/30 ring-1 ring-foreground/5",
        "supports-[backdrop-filter]:bg-background/25 backdrop-blur-xl",
        className
      )}
    >
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {hints && hints.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground/85">Try</p>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {hints.slice(0, 4).map((hint) => (
                <li key={hint} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {actions && actions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem] border-border/70",
                    action.kind === "primary"
                      ? "bg-accent/30 text-foreground"
                      : "bg-background/35 hover:bg-background/45"
                  )}
                >
                  {action.label}
                </Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
