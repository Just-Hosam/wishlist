export interface RawHLTBTokenResponse {
  token?: string
  hpKey?: string
  hpVal?: string
}

export interface RawHLTBSearchResponse {
  data?: Array<{
    comp_main?: number | null
    comp_plus?: number | null
    comp_100?: number | null
  }>
}

export interface HLTBSearchPayload {
  searchType: "games"
  searchTerms: string[]
  searchPage: number
  size: number
  searchOptions: {
    games: {
      userId: number
      platform: string
      sortCategory: "popular"
      rangeCategory: "main"
      rangeTime: {
        min: null
        max: null
      }
      gameplay: {
        perspective: string
        flow: string
        genre: string
        difficulty: string
      }
      rangeYear: {
        min: string
        max: string
      }
      modifier: string
    }
    users: {
      sortCategory: "postcount"
    }
    lists: {
      sortCategory: "follows"
    }
    filter: string
    sort: number
    randomizer: number
  }
  useCache: boolean
}
