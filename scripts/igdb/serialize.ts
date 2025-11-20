import { Platform } from "@prisma/client"
import { RawIGDBGame, SerializedIGDBGame } from "./types"

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

const chooseVideoId = (videos: RawIGDBGame["videos"] = []): string | null => {
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
  const match = url.match(/concept\/(\d+)/)
  return match ? match[1] : null
}

const segmentNintendoURL = (url: string): string | null => {
  const match = url.match(/games\/detail\/([\w-]+)/)
  return match ? match[1] : null
}

const segmentSteamURL = (url: string): string | null => {
  const match = url.match(/store.steampowered.com\/app\/(\d+)/)
  return match ? match[1] : null
}

const mapPlatforms = (platforms: RawIGDBGame["platforms"]): Platform[] => {
  if (!platforms) {
    return []
  }

  return platforms
    .map((platform) => platformMap[platform.id])
    .filter((platform): platform is Platform => platform !== undefined)
}

const findWebsiteByType = (
  websites: RawIGDBGame["websites"],
  type: number
): string | null => {
  if (!websites) {
    return null
  }

  return websites.find((website) => website.type === type)?.url ?? null
}

export const serializeGame = (game: RawIGDBGame): SerializedIGDBGame => {
  return {
    igdbId: game.id,
    name: game.name,
    slug: game.slug,
    alternativeNames:
      game.alternative_names?.map((alt) => alt.name).filter(Boolean) ?? [],
    summary: game.summary ?? "",
    coverImageId: game.cover?.image_id ?? "",
    screenshotImageIds:
      game.screenshots?.slice(0, 5).map((screenshot) => screenshot.image_id) ??
      [],
    videoId: chooseVideoId(game.videos),
    genreIds: game.genres?.map((genre) => genre.id) ?? [],
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
    steamUrlSegment: segmentSteamURL(
      findWebsiteByType(game.websites, 13) ?? ""
    ),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export const serializeGames = (
  games: RawIGDBGame[]
): SerializedIGDBGame[] => games.map(serializeGame)
