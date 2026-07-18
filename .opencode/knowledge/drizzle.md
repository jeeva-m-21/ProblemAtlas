# Drizzle ORM Knowledge Base

## Version: 0.45.2
Significant API changes from v0.43. Use official docs for exact API.

## Schema Patterns
```typescript
import { pgTable, uuid, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["a", "b", "c"]);

export const table = pgTable("table_name", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
}, (table) => [
  index("idx_name").on(table.name),
]);
```

## Query Patterns
```typescript
// Find many
db.query.table.findMany({
  where: and(eq(table.status, "active"), isNull(table.deletedAt)),
  orderBy: [desc(table.createdAt)],
  with: { relatedTable: true },
});

// Find first
db.query.table.findFirst({
  where: and(eq(table.id, id), isNull(table.deletedAt)),
  with: { related: true },
});

// Insert
await db.insert(table).values({ name: "..." });

// Update (soft delete)
await db.update(table).set({ deletedAt: new Date() }).where(eq(table.id, id));

// Raw SQL (parameterized)
await db.execute(sql`SELECT * FROM table WHERE col = ${value}`);
```

## This Project's Patterns
- Serverless pooling: production max=1, dev max=10
- Always filter soft deletes: isNull(table.deletedAt)
- Use relations() for type-safe joins
- Explicit column selection, avoid SELECT *
- Full-text search via raw SQL with sql tag
