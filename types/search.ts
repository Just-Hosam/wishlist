import { SearchKeyword } from "@prisma/client"

export const SEARCH_GAME_FIELDS = `id, name, slug, alternative_names.name`

export type SearchKeywordInput = Omit<
  SearchKeyword,
  "id" | "createdAt" | "updatedAt"
>

export type SearchKeywordOutput = SearchKeyword

export interface RawSearchGame {
  id: number
  name: string
  slug: string
  alternative_names?: { name: string }[]
}
