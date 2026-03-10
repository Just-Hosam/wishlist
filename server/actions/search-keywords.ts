import { normalizeKeywordText } from "@/lib/search"
import prisma from "@/lib/prisma"
import {
  MAX_SEARCH_KEYWORD_SUGGESTIONS,
  MIN_SEARCH_KEYWORD_QUERY_LENGTH,
  SearchKeywordSuggestion
} from "@/types/search"
import { Prisma } from "@prisma/client"

const NAME_SIMILARITY_THRESHOLD = 0.2
const SLUG_SIMILARITY_THRESHOLD = 0.2
const DOCUMENT_SIMILARITY_THRESHOLD = 0.25

type SearchKeywordSuggestionRow = SearchKeywordSuggestion & {
  exactScore: number
  prefixScore: number
  tokenMatches: number
  fuzzyScore: number
}

export async function searchKeywordSuggestions(
  query: string
): Promise<SearchKeywordSuggestion[]> {
  const normalizedQuery = normalizeKeywordText(query)

  if (normalizedQuery.length < MIN_SEARCH_KEYWORD_QUERY_LENGTH) {
    return []
  }

  const prefixPattern = `${normalizedQuery}%`
  const containsPattern = `%${normalizedQuery}%`

  const suggestions = await prisma.$queryRaw<SearchKeywordSuggestionRow[]>(
    Prisma.sql`
      SELECT
        "igdbId" AS "igdbId",
        name,
        CASE
          WHEN "nameNormalized" = ${normalizedQuery} THEN 400
          WHEN "slugNormalized" = ${normalizedQuery} THEN 350
          ELSE 0
        END AS "exactScore",
        CASE
          WHEN "nameNormalized" LIKE ${prefixPattern} THEN 100
          WHEN "slugNormalized" LIKE ${prefixPattern} THEN 80
          ELSE 0
        END AS "prefixScore",
        (
          SELECT COUNT(*)
          FROM unnest(regexp_split_to_array(${normalizedQuery}, '\s+')) AS token
          WHERE token <> ''
            AND "SearchKeyword"."searchDocumentNormalized" LIKE '%' || token || '%'
        ) AS "tokenMatches",
        GREATEST(
          similarity("nameNormalized", ${normalizedQuery}),
          similarity("slugNormalized", ${normalizedQuery}),
          word_similarity(${normalizedQuery}, "searchDocumentNormalized")
        ) AS "fuzzyScore"
      FROM "SearchKeyword"
      WHERE
        "nameNormalized" LIKE ${containsPattern}
        OR "slugNormalized" LIKE ${containsPattern}
        OR "searchDocumentNormalized" LIKE ${containsPattern}
        OR similarity("nameNormalized", ${normalizedQuery}) >= ${NAME_SIMILARITY_THRESHOLD}
        OR similarity("slugNormalized", ${normalizedQuery}) >= ${SLUG_SIMILARITY_THRESHOLD}
        OR word_similarity(${normalizedQuery}, "searchDocumentNormalized") >= ${DOCUMENT_SIMILARITY_THRESHOLD}
      ORDER BY
        "exactScore" DESC,
        "prefixScore" DESC,
        "tokenMatches" DESC,
        "fuzzyScore" DESC,
        char_length(name) ASC,
        name ASC
      LIMIT ${MAX_SEARCH_KEYWORD_SUGGESTIONS}
    `
  )

  return suggestions.map(({ igdbId, name }) => ({ igdbId, name }))
}
