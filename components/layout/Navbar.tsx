"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Explore", href: "/explore" },
  { label: "Spaces", href: "/spaces" },
  { label: "Profile", href: "/profile/me" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "border-b border-border/60",
        "bg-background/70 supports-[backdrop-filter]:bg-background/55",
        "backdrop-blur-xl"
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-6">
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
              <span className="hidden sm:inline text-muted-foreground">
                research OS
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm",
                      "transition-colors",
                      active
                        ? "bg-accent/30 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/20",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex md:hidden items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-sm",
                      "transition-colors",
                      active
                        ? "bg-accent/30 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/20",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
