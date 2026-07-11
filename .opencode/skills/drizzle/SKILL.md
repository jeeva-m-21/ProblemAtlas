---
name: drizzle
description: Use when writing Drizzle ORM queries, schema definitions, migrations, or seed scripts for PostgreSQL. Covers drizzle-orm v0.45 and drizzle-kit v0.31.
---

# Drizzle ORM Patterns

## Schema Definition
- Use `pgTable()` with proper column types: `uuid`, `serial`, `text`, `integer`, `timestamp`, `boolean`, `jsonb`
- Use `pgEnum()` for enum types
- Define relations with `relations()` function for each table
- Add indexes with `index()` inside a second argument to `pgTable()`
- Add check constraints with `check()`

## Relations Pattern
```typescript
export const tableRelations = relations(table, ({ one, many }) => ({
  relatedName: one(relatedTable, {
    fields: [table.fkColumn],
    references: [relatedTable.pkColumn],
  }),
  childItems: many(childTable),
}));
```

## Queries
- Use `db.query.table.findMany()` for SELECT with relations
- Use `db.insert(table).values()` for INSERT
- Use `db.update(table).set()` for UPDATE
- Use `db.delete(table)` for DELETE (but prefer soft delete via `deletedAt`)

## Soft Delete Pattern
All content tables have `deletedAt` columns. Always filter:
```typescript
import { isNull } from "drizzle-orm";
// in WHERE clause: isNull(table.deletedAt)
```

## Serverless Connection
- Production: `max: 1` connection per function instance
- Dev: `max: 10` connections for local long-running process
- Always use `postgres` package (not `pg`)
