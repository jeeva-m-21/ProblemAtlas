ALTER TABLE problems ADD COLUMN IF NOT EXISTS tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english',
      coalesce(description_short, '') || ' ' || coalesce(description_full, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_problems_tsv ON problems USING GIN(tsv);
