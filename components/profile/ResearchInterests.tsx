import type { Profile } from "@/lib/data/profiles";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResearchInterests({ profile }: { profile: Profile }) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-mono text-muted-foreground/85">Interests</p>
        <h2 className="text-lg font-semibold tracking-tight">Research interests</h2>
      </div>

      <Card className="bg-card/55 ring-1 ring-foreground/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-sm">Focus areas</CardTitle>
          <p className="text-xs text-muted-foreground">
            Organized keywords used for routing discussions and collaboration.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {profile.interests.map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="h-7 px-3 text-[0.8rem] bg-background/35 border-border/70"
            >
              {t}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
