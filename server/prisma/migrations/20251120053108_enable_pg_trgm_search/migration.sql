-- Enable pg_trgm extension for trigram-based text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on IGDBGame.name for fast similarity searches
CREATE INDEX IF NOT EXISTS "IGDBGame_name_trgm_idx" ON "IGDBGame" USING GIN (name gin_trgm_ops);

-- Create GIN index on IGDBGame.slug for exact/prefix matching
CREATE INDEX IF NOT EXISTS "IGDBGame_slug_trgm_idx" ON "IGDBGame" USING GIN (slug gin_trgm_ops);

-- Create GIN index on alternativeNames array for searching within alternative names
-- This allows searching if ANY alternative name matches
CREATE INDEX IF NOT EXISTS "IGDBGame_alternativeNames_idx" ON "IGDBGame" USING GIN ("alternativeNames");