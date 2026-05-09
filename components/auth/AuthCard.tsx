import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "bg-card/55 ring-1 ring-foreground/10",
        "border-border/60",
        "overflow-hidden",
        className
      )}
    >
      <CardHeader className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold tracking-tight">
            {title}
          </CardTitle>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {children}
        {footer ? <div className="pt-2">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
