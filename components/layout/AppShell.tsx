"use client";

import Link from "next/link";
import type React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/lib/navigation";
import { ResponsiveContainer } from "@/components/system/ResponsiveContainer";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FloatingActionDock } from "@/components/system/FloatingActionDock";
import { SystemStatusBar } from "@/components/system/SystemStatusBar";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const chromeless = pathname.startsWith("/auth") || pathname.startsWith("/onboarding");

  return (
    <div className={cn("min-h-full", className)}>
      <header
        className={cn(
          "sticky top-0 z-50",
          "border-b border-border/60",
          "bg-background/60 supports-[backdrop-filter]:bg-background/45",
          "backdrop-blur-xl"
        )}
      >
        <ResponsiveContainer>
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {!chromeless ? (
                <div className="md:hidden">
                  <MobileSidebar />
                </div>
              ) : null}

              <Link
                href="/"
                className={cn(
                  "inline-flex items-baseline gap-2",
                  "text-sm font-medium tracking-tight",
                  "text-foreground/95 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "rounded-md"
                )}
              >
                <span className="text-foreground">ProblemAtlas</span>
                <span className="hidden sm:inline text-muted-foreground">research OS</span>
              </Link>

              {!chromeless ? (
                <div className="hidden md:block">
                  <Breadcrumbs />
                </div>
              ) : null}
            </div>

            {!chromeless ? (
              <nav className="hidden md:flex items-center gap-1">
                {PRIMARY_NAV.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-accent/30",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </ResponsiveContainer>
      </header>

      <main>
        {chromeless ? (
          <>{children}</>
        ) : (
          <ResponsiveContainer>
            <div className="py-8 pb-16">{children}</div>
          </ResponsiveContainer>
        )}
      </main>

      {!chromeless ? (
        <>
          <FloatingActionDock />
          <SystemStatusBar />
        </>
      ) : null}
    </div>
  );
}
