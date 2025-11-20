-- Test pg_trgm Extension Setup
-- Run this in your PostgreSQL client to verify the setup

-- 1. Check if pg_trgm extension is enabled
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

-- 2. Check if indexes were created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'IGDBGame'
ORDER BY indexname;

-- 3. Test similarity function
-- (This will only work if you have data in IGDBGame table)
SELECT 
  name,
  similarity(name, 'zelda') as similarity_score
FROM "IGDBGame"
WHERE similarity(name, 'zelda') > 0.1
ORDER BY similarity_score DESC
LIMIT 5;

-- 4. Test ILIKE search
SELECT 
  name,
  slug,
  platforms
FROM "IGDBGame"
WHERE name ILIKE '%mario%'
LIMIT 5;

-- 5. Test alternative names search
SELECT 
  name,
  "alternativeNames"
FROM "IGDBGame"
WHERE 'Super Mario' = ANY("alternativeNames")
LIMIT 5;

-- 6. Check index usage with EXPLAIN
EXPLAIN ANALYZE
SELECT * FROM "IGDBGame"
WHERE similarity(name, 'zelda') > 0.1
ORDER BY similarity(name, 'zelda') DESC
LIMIT 10;
