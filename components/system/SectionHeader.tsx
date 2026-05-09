import type React from "react";

import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  right,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground/95">
            {title}
          </h2>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </header>
  );
}
