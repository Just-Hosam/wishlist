import { SearchKeyword } from "@prisma/client"

export const MIN_SEARCH_KEYWORD_QUERY_LENGTH = 2
export const MAX_SEARCH_KEYWORD_SUGGESTIONS = 5
export const SEARCH_GAME_FIELDS = `id, name, slug, alternative_names.name`

export type SearchKeywordInput = Omit<
  SearchKeyword,
  "id" | "createdAt" | "updatedAt"
>

export type SearchKeywordOutput = SearchKeyword

export type SearchKeywordSuggestion = Pick<SearchKeyword, "igdbId" | "name">

export interface RawSearchGame {
  id: number
  name: string
  slug: string
  alternative_names?: { name: string }[]
}
