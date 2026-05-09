"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const DEFAULT_LABELS = [
  { key: "metrics", label: "metrics" },
  { key: "risk", label: "risk" },
  { key: "ux", label: "ux" },
  { key: "infra", label: "infra" },
] as const;

type LabelKey = (typeof DEFAULT_LABELS)[number]["key"];

export function DiscussionComposer({
  placeholder = "Write a research note…",
  submitLabel = "Post note",
}: {
  placeholder?: string;
  submitLabel?: string;
}) {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<Set<LabelKey>>(new Set());

  const selectedList = useMemo(() => Array.from(selected), [selected]);
  const isEmpty = value.trim().length === 0;

  function toggle(label: LabelKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function handleSubmit() {
    // MVP: UI-only. Keep the surface polished without wiring persistence yet.
    setValue("");
    setSelected(new Set());
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60",
        "bg-background/40 ring-1 ring-foreground/5",
        "shadow-[0_1px_0_0_oklch(from_var(--foreground)_l_c_h_/_0.03)]",
        "p-4 sm:p-5",
        "transition-colors",
        "focus-within:bg-background/55"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground/90">
            Add to the thread
          </p>
          <p className="text-xs text-muted-foreground">
            Markdown-friendly research notes. Keep it high-signal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-background/30 border-border/70">
            Draft
          </Badge>
          <Badge
            variant="outline"
            className="bg-background/30 border-border/70 font-mono"
          >
            Ctrl+Enter
          </Badge>
        </div>
      </div>

      <div className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-h-28",
            "bg-background/25 border-border/70",
            "placeholder:text-muted-foreground/70"
          )}
          aria-label="Discussion composer"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              if (!isEmpty) handleSubmit();
            }
          }}
        />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted-foreground">Label:</p>
          {DEFAULT_LABELS.map((l) => {
            const active = selected.has(l.key);
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => toggle(l.key)}
                className={cn(
                  "rounded-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                aria-label={`Toggle label ${l.label}`}
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 px-3 text-[0.8rem]",
                    "bg-background/30 border-border/70",
                    active && "bg-background/55 border-border"
                  )}
                >
                  {l.label}
                </Badge>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-background/30 border-border/70"
            type="button"
            onClick={() => {
              setValue("");
              setSelected(new Set());
            }}
            aria-label="Clear draft"
            disabled={isEmpty && selected.size === 0}
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isEmpty}
            aria-label="Submit discussion note (UI only)"
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      {selectedList.length > 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Labels: <span className="font-mono">{selectedList.join(", ")}</span>
        </p>
      ) : null}
    </div>
  );
}
