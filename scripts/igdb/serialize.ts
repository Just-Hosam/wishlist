import { RawIGDBAPIGame } from "@/types"
import { Platform } from "@prisma/client"

const platformMap: Record<number, Platform> = {
  6: Platform.PC,
  48: Platform.PLAYSTATION,
  167: Platform.PLAYSTATION,
  130: Platform.NINTENDO,
  508: Platform.NINTENDO,
  169: Platform.XBOX
}

const VIDEO_NAME_RANKING = [
  "Launch Trailer",
  "Trailer",
  "Announcement Trailer",
  "Gameplay Trailer",
  "Release Date Trailer",
  "Gameplay Video",
  "Game Intro"
]

const chooseVideoId = (
  videos: RawIGDBAPIGame["videos"] = []
): string | null => {
  if (videos.length === 0) {
    return null
  }

  const ranked = [...videos].sort((a, b) => {
    const rankA = VIDEO_NAME_RANKING.indexOf(a.name)
    const rankB = VIDEO_NAME_RANKING.indexOf(b.name)
    const safeRankA = rankA === -1 ? Number.MAX_SAFE_INTEGER : rankA
    const safeRankB = rankB === -1 ? Number.MAX_SAFE_INTEGER : rankB
    return safeRankA - safeRankB
  })

  return ranked[0]?.video_id ?? null
}

const segmentPSURL = (url: string): string | null => {
  // Handle both /concept/ and /product/ URL formats
  const conceptMatch = url.match(/concept\/(\d+)/)
  if (conceptMatch) return conceptMatch[1]

  const productMatch = url.match(/product\/([\w-]+)/)
  if (productMatch) return productMatch[1]

  return null
}

const segmentNintendoURL = (url: string): string | null => {
  // Handle both /games/detail/ and /store/products/ URL formats
  const detailMatch = url.match(/games\/detail\/([\w-]+)/)
  if (detailMatch) return detailMatch[1]

  const productsMatch = url.match(/store\/products\/([\w-]+)/)
  if (productsMatch) return productsMatch[1]

  return null
}

const segmentSteamURL = (url: string): string | null => {
  const match = url.match(/store.steampowered.com\/app\/(\d+)/)
  return match ? match[1] : null
}

const mapPlatforms = (platforms: RawIGDBAPIGame["platforms"]): Platform[] => {
  if (!platforms) {
    return []
  }

  return platforms
    .map((platform) => platformMap[platform.id])
    .filter((platform): platform is Platform => platform !== undefined)
}

const findWebsiteByType = (
  websites: RawIGDBAPIGame["websites"],
  type: number
): string | null => {
  if (!websites) {
    return null
  }

  return websites.find((website) => website.type === type)?.url ?? null
}

export const serializeGame = (game: RawIGDBAPIGame) => {
  return {
    igdbId: game.id,
    name: game.name,
    slug: game.slug,
    summary: game.summary ?? "",
    coverImageId: game.cover?.image_id ?? "",
    screenshotImageIds:
      game.screenshots?.slice(0, 5).map((screenshot) => screenshot.image_id) ??
      [],
    videoId: chooseVideoId(game.videos),
    platforms: mapPlatforms(game.platforms),
    firstReleaseDate: game.first_release_date ?? 0,
    hypes: game.hypes ?? 0,
    rating: game.rating ?? null,
    ratingCount: game.rating_count ?? 0,
    aggregatedRating: game.aggregated_rating ?? null,
    aggregatedRatingCount: game.aggregated_rating_count ?? 0,
    playstationUrlSegment: segmentPSURL(
      findWebsiteByType(game.websites, 23) ?? ""
    ),
    nintendoUrlSegment: segmentNintendoURL(
      findWebsiteByType(game.websites, 24) ?? ""
    ),
    steamUrlSegment: segmentSteamURL(findWebsiteByType(game.websites, 13) ?? "")
  }
}

export const serializeGames = (games: RawIGDBAPIGame[]) =>
  games.map(serializeGame)
