import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function searchProblems(input: string, domain?: string) {
  return db.execute(sql`
    SELECT
      id,
      title,
      domain,
      description_short,
      feasibility_score,
      implementation_scope,
      ts_rank(tsv, plainto_tsquery('english', ${input})) AS rank
    FROM problems
    WHERE validation_status = 'published'
      AND deleted_at IS NULL
      AND tsv @@ plainto_tsquery('english', ${input})
      AND (${domain ?? null} IS NULL OR domain = ${domain ?? null})
    ORDER BY rank DESC
    LIMIT 50
  `);
}
