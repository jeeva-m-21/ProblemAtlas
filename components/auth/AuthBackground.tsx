import { cn } from "@/lib/utils";

export function AuthBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative min-h-[calc(100vh-56px)]", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,hsl(var(--foreground)/0.055),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_0%_18%,hsl(var(--foreground)/0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_100%_18%,hsl(var(--foreground)/0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,transparent,hsla(0,0%,100%,0.02))]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  );
}
