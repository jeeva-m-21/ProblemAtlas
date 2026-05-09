"use client";

import type React from "react";

import { cn } from "@/lib/utils";

export type ResponsiveContainerSize = "default" | "wide" | "narrow";

export function ResponsiveContainer({
  children,
  size = "default",
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  size?: ResponsiveContainerSize;
  className?: string;
  innerClassName?: string;
}) {
  const maxWidth =
    size === "wide" ? "max-w-7xl" : size === "narrow" ? "max-w-4xl" : "max-w-6xl";

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "mx-auto w-full",
          maxWidth,
          "px-4 sm:px-6 lg:px-8",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
