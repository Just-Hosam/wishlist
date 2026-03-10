import { RawSearchGame, SearchKeywordInput } from "@/types/search"
import { joinNormalizedKeywordParts, normalizeKeywordText } from "./normalize"

const getAlternativeNames = (game: RawSearchGame): string[] => {
  const seen = new Set<string>()

  return (game.alternative_names ?? [])
    .map((alternativeName) => alternativeName.name.trim())
    .filter((alternativeName) => {
      if (!alternativeName) {
        return false
      }

      const normalizedAlternativeName = normalizeKeywordText(alternativeName)
      if (!normalizedAlternativeName || seen.has(normalizedAlternativeName)) {
        return false
      }

      seen.add(normalizedAlternativeName)
      return true
    })
}

export const serializeSearchKeyword = (
  game: RawSearchGame
): SearchKeywordInput => {
  const alternativeNames = getAlternativeNames(game)

  return {
    igdbId: game.id,
    name: game.name,
    slug: game.slug,
    alternativeNames,
    nameNormalized: normalizeKeywordText(game.name),
    slugNormalized: normalizeKeywordText(game.slug),
    searchDocumentNormalized: joinNormalizedKeywordParts([
      game.name,
      game.slug,
      ...alternativeNames
    ])
  }
}

export const serializeSearchKeywords = (games: RawSearchGame[]) =>
  games.map(serializeSearchKeyword)
