"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, isActivePath } from "@/lib/navigation";

export function MobileSidebar({
  className,
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl px-3",
              "border border-border/60 bg-background/35",
              "text-xs text-muted-foreground hover:text-foreground hover:bg-background/45",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            aria-label="Open navigation"
          >
            <Layers className="size-4" aria-hidden="true" />
            <span className="font-mono">nav</span>
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className={cn(
            "bg-popover/85 supports-[backdrop-filter]:bg-popover/65 backdrop-blur-xl",
            "border-border/60"
          )}
        >
          <SheetHeader>
            <SheetTitle>ProblemAtlas</SheetTitle>
            <SheetDescription>
              Research OS navigation
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2 px-4">
            {PRIMARY_NAV.map((item) => {
              const active = isActivePath({ pathname, item });

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-2xl px-3 py-2",
                    "border border-transparent",
                    "transition-colors",
                    active
                      ? "bg-accent/20 text-foreground border-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/15"
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight">
                      {item.label}
                    </p>
                    {item.description ? (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  {active ? (
                    <Badge
                      variant="outline"
                      className="bg-background/25 border-border/70"
                    >
                      active
                    </Badge>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 px-4">
            <div className="rounded-2xl border border-border/60 bg-background/20 ring-1 ring-foreground/5 p-4">
              <p className="text-xs font-mono text-muted-foreground/85">Hint</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Use <span className="font-mono text-foreground/70">Ctrl/⌘ K</span> to
                open the command bar.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
