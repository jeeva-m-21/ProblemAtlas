"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/navigation";

export function Breadcrumbs({
  className,
  maxItems = 4,
}: {
  className?: string;
  maxItems?: number;
}) {
  const pathname = usePathname();

  const crumbs = React.useMemo(() => buildBreadcrumbs(pathname), [pathname]);

  const visible = crumbs.length > maxItems ? crumbs.slice(crumbs.length - maxItems) : crumbs;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      {visible.map((item, idx) => {
        const isLast = idx === visible.length - 1;
        return (
          <React.Fragment key={item.href}>
            {idx > 0 ? (
              <span className="text-xs text-muted-foreground/60">/</span>
            ) : null}
            {isLast ? (
              <span className="min-w-0 truncate text-xs font-mono text-foreground/70">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "min-w-0 truncate rounded-md px-1.5 py-1 text-xs font-mono",
                  "text-muted-foreground hover:text-foreground",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
