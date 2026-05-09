"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command, CornerDownLeft, Search } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const OPEN_EVENT = "problematlas:commandbar:open";

type CommandAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  keywords: string[];
  section: "Navigate" | "Actions";
};

const ACTIONS: CommandAction[] = [
  {
    id: "nav-explore",
    label: "Explore Problems",
    description: "Browse curated research and engineering gaps",
    href: "/explore",
    keywords: ["explore", "problems", "research"],
    section: "Navigate",
  },
  {
    id: "nav-search",
    label: "Global Search",
    description: "Search the research graph across types",
    href: "/search",
    keywords: ["search", "discover", "command"],
    section: "Navigate",
  },
  {
    id: "nav-profile",
    label: "Your Profile",
    description: "Research identity, contributions, activity",
    href: "/profile/me",
    keywords: ["profile", "identity"],
    section: "Navigate",
  },
  {
    id: "nav-sign-in",
    label: "Sign in",
    description: "Enter the research OS",
    href: "/auth/sign-in",
    keywords: ["auth", "login", "signin"],
    section: "Navigate",
  },
  {
    id: "nav-sign-up",
    label: "Sign up",
    description: "Create a research identity",
    href: "/auth/sign-up",
    keywords: ["auth", "signup", "register"],
    section: "Navigate",
  },
  {
    id: "nav-onboarding",
    label: "Onboarding",
    description: "Configure domains and collaboration intent",
    href: "/onboarding",
    keywords: ["onboarding", "domains", "interests"],
    section: "Navigate",
  },
  {
    id: "act-open-search",
    label: "Search: focus query",
    description: "Open global search with a focused surface",
    href: "/search",
    keywords: ["search", "focus", "query"],
    section: "Actions",
  },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchActions(query: string) {
  const q = normalize(query);
  if (!q) return ACTIONS;
  const tokens = q.split(" ").filter(Boolean);

  return ACTIONS.filter((a) => {
    const hay = normalize(
      [a.label, a.description, a.section, ...a.keywords].join(" ")
    );
    return tokens.every((t) => hay.includes(t));
  });
}

export function GlobalCommandBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo(() => matchActions(query), [query]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const isK = key === "k";
      const isMeta = event.metaKey;
      const isCtrl = event.ctrlKey;

      if (isK && (isMeta || isCtrl)) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onOpenEvent() {
      setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent as EventListener);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent as EventListener);
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
    return () => window.clearTimeout(id);
  }, [open]);

  function run(action: CommandAction) {
    setOpen(false);
    setQuery("");
    router.push(action.href);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const first = results[0];
    if (first) run(first);
  }

  const nav = results.filter((r) => r.section === "Navigate");
  const acts = results.filter((r) => r.section === "Actions");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "sm:max-w-xl",
          "bg-popover/80 supports-[backdrop-filter]:bg-popover/65 backdrop-blur-xl",
          "border border-border/60"
        )}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Command Bar</DialogTitle>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-wide text-muted-foreground">
                Command Bar
              </p>
              <p className="text-sm font-semibold tracking-tight">
                Navigate and act across the graph
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/20 px-3 py-2 text-xs text-muted-foreground">
              <Command className="size-3.5" aria-hidden="true" />
              <span className="font-mono">Ctrl/⌘ K</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, and actions…"
                className={cn(
                  "h-11 pl-10",
                  "bg-background/20 border-border/70"
                )}
                aria-label="Command bar search"
                autoComplete="off"
              />
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/15 ring-1 ring-foreground/5">
              <div className="max-h-[360px] overflow-auto p-2">
                {nav.length > 0 ? (
                  <div className="space-y-1">
                    <p className="px-2 pb-1 pt-2 text-[0.7rem] font-mono text-muted-foreground/85">
                      Navigate
                    </p>
                    {nav.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => run(action)}
                        className={cn(
                          "w-full rounded-xl px-3 py-2 text-left",
                          "transition-colors",
                          "hover:bg-accent/20",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium tracking-tight text-foreground/95">
                              {action.label}
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                          <CornerDownLeft className="mt-1 size-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {acts.length > 0 ? (
                  <div className="space-y-1">
                    <p className="px-2 pb-1 pt-3 text-[0.7rem] font-mono text-muted-foreground/85">
                      Actions
                    </p>
                    {acts.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => run(action)}
                        className={cn(
                          "w-full rounded-xl px-3 py-2 text-left",
                          "transition-colors",
                          "hover:bg-accent/20",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium tracking-tight text-foreground/95">
                              {action.label}
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                          <CornerDownLeft className="mt-1 size-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {nav.length === 0 && acts.length === 0 ? (
                  <div className="px-3 py-6 text-sm text-muted-foreground">
                    No matches. Try fewer words.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Enter runs the top match.
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                UI-only MVP
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function openGlobalCommandBar() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}
