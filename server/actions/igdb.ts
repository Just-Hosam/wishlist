"use server"

import { buildRequestHeaders } from "@/lib/request"
import { tryCatch } from "@/lib/try-catch"
import { IGDBGame, IGDBPopscore, Platform, RawIGDBGame } from "@/types"
import { unstable_cache } from "next/cache"

const IGDB_GAMES_ENDPOINT = "https://api.igdb.com/v4/games"
const IGDB_POPSCORE_ENDPOINT = "https://api.igdb.com/v4/popularity_primitives"

const IGDB_GAME_FIELDS = `
  name, slug,
  summary,
  first_release_date,
  websites.type, websites.url,
  platforms.id,
  cover.image_id, screenshots.image_id, videos.video_id, videos.name,
  hypes, rating, rating_count, aggregated_rating, aggregated_rating_count
`

const IGDB_DISCOVER_WHERE_FILTER = `
  game_type = (0, 2, 3, 8, 9)
  & platforms = (48, 167, 130, 508, 6, 169)
  & first_release_date != null
  & first_release_date >= 946688461
  & summary != null
  & cover != null
  & videos != null
  & genres != null
  & themes != (42)
  & keywords != (343, 847, 2509, 3586, 26306)
`

function escapeIGDBString(input: string): string {
  return input
    .trim()
    .replace(/\\/g, "\\\\") // keep literal backslashes in the query
    .replace(/"/g, '\\"') // keep literal double quotes in the query
    .replace(/[\u0000-\u001F\u007F]/g, "") // remove non-printable control characters
}

function parsePositiveIGDBId(value: string, field: string): number {
  const isDigitsOnly = /^\d+$/.test(value)
  if (!isDigitsOnly) {
    throw new Error(`Invalid ${field}`)
  }

  const parsed = Number(value)

  const isPositiveInteger = Number.isSafeInteger(parsed) && parsed > 0
  if (!isPositiveInteger) {
    throw new Error(`Invalid ${field}`)
  }

  return parsed
}

function getIGDBCredentials() {
  const CLIENT_ID = process.env.IGDB_CLIENT_ID
  const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

  if (!CLIENT_ID || !ACCESS_TOKEN) {
    throw new Error("IGDB_CLIENT_ID and IGDB_ACCESS_TOKEN must be provided")
  }

  return { CLIENT_ID, ACCESS_TOKEN }
}

async function queryIGDB<T>(endpoint: string, body: string): Promise<T> {
  const { CLIENT_ID, ACCESS_TOKEN } = getIGDBCredentials()

  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildRequestHeaders({
      kind: "api",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
        accept: "application/json"
      }
    }),
    body
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`IGDB API error (${response.status}): ${errorText}`)
  }

  return (await response.json()) as T
}

/**
 * Calculate recency weight based on release date
 * Multi-tiered system with stronger drop-offs for older games
 */
function calculateRecencyWeight(firstReleaseDateSec?: number): number {
  if (!firstReleaseDateSec) return 1.0

  const nowMs = Date.now()
  const relMs = firstReleaseDateSec * 1000
  const months = (nowMs - relMs) / (1000 * 60 * 60 * 24 * 30)

  // Tier 1: Upcoming games (negative months) - Highest boost
  if (months < 0) {
    // Upcoming games within next 24 months get strongest boost
    const futureBoost = Math.max(0, Math.min(-months / 24, 1))
    return 1.0 + futureBoost * 0.6 // Up to 1.6x boost for upcoming
  }

  // Tier 2: Just released (0-6 months) - Maximum recency boost
  if (months < 6) {
    return 1.5 - (months / 6) * 0.1 // 1.5x to 1.4x
  }

  // Tier 3: Very recent (6-12 months) - Strong boost
  if (months < 12) {
    return 1.4 - ((months - 6) / 6) * 0.15 // 1.4x to 1.25x
  }

  // Tier 4: Recent (12-24 months) - Good boost
  if (months < 24) {
    return 1.25 - ((months - 12) / 12) * 0.2 // 1.25x to 1.05x
  }

  // Tier 5: Somewhat recent (2-3 years) - Slight boost
  if (months < 36) {
    return 1.05 - ((months - 24) / 12) * 0.15 // 1.05x to 0.9x
  }

  // Tier 6: Getting older (3-5 years) - Neutral to slight penalty
  if (months < 60) {
    return 0.9 - ((months - 36) / 24) * 0.15 // 0.9x to 0.75x
  }

  // Tier 7: Old (5-7 years) - Moderate penalty
  if (months < 84) {
    return 0.75 - ((months - 60) / 24) * 0.15 // 0.75x to 0.6x
  }

  // Tier 8: Very old (7-10 years) - Strong penalty
  if (months < 120) {
    return 0.6 - ((months - 84) / 36) * 0.15 // 0.6x to 0.45x
  }

  // Tier 9: Ancient (10+ years) - Severe penalty
  return Math.max(0.25, 0.45 - ((months - 120) / 60) * 0.15) // 0.45x down to 0.25x minimum
}

/**
 * Calculate quality score for a game based on multiple factors
 */
function calculateQualityScore(game: IGDBGame): number {
  // Bayesian average constants
  // These represent the "prior" belief about average ratings and minimum votes needed
  const BAYESIAN_CONSTANTS = {
    userPriorMean: 70, // Average user rating across all games (out of 100)
    userMinVotes: 50, // Confidence parameter - higher means more votes needed to deviate from prior
    criticPriorMean: 75, // Average critic rating across all games (out of 100)
    criticMinVotes: 10 // Critics have fewer reviews but more weight per review
  }

  // Weights for different components
  const WEIGHTS = {
    userRating: 0.3, // User ratings (Bayesian average)
    criticRating: 0.2, // Critic ratings (Bayesian average)
    recency: 0.25, // Recent/upcoming releases get strong boost
    hypes: 0.15, // Community hype (important for new games)
    completeness: 0.05, // Has screenshots, videos, store links
    popularity: 0.05 // Combined rating counts
  }

  // Note: No similarity score for API search (IGDB handles relevance)

  // 1. User Rating Score (Bayesian average)
  // Formula: (C × m + v × R) / (C + v)
  // Where: C = confidence (min votes), m = prior mean, v = actual votes, R = actual rating
  const userRating = game.rating ?? 0
  const userCount = game.ratingCount ?? 0
  const bayesianUserRating =
    userCount > 0
      ? (BAYESIAN_CONSTANTS.userMinVotes * BAYESIAN_CONSTANTS.userPriorMean +
          userCount * userRating) /
        (BAYESIAN_CONSTANTS.userMinVotes + userCount)
      : BAYESIAN_CONSTANTS.userPriorMean

  // Apply log scaling to the vote count for diminishing returns
  const userScore =
    bayesianUserRating * (userCount > 0 ? Math.log10(userCount + 1) : 0)

  // 2. Critic Rating Score (Bayesian average)
  const criticRating = game.aggregatedRating ?? 0
  const criticCount = game.aggregatedRatingCount ?? 0
  const bayesianCriticRating =
    criticCount > 0
      ? (BAYESIAN_CONSTANTS.criticMinVotes *
          BAYESIAN_CONSTANTS.criticPriorMean +
          criticCount * criticRating) /
        (BAYESIAN_CONSTANTS.criticMinVotes + criticCount)
      : BAYESIAN_CONSTANTS.criticPriorMean

  const criticScore =
    bayesianCriticRating * (criticCount > 0 ? Math.log10(criticCount + 1) : 0)

  // 3. Recency Score
  const recencyScore = calculateRecencyWeight(game.firstReleaseDate) * 100

  // 4. Hypes Score (stronger for highly anticipated games)
  // Use square root of log to give more weight to higher hype counts
  const hypesScore = game.hypes ? Math.sqrt(Math.log10(game.hypes + 1)) * 35 : 0

  // 5. Completeness Score (penalize games missing key properties)
  let completenessScore = 100
  if (!game.screenshotImageIds || game.screenshotImageIds.length === 0) {
    completenessScore -= 30 // Missing screenshots is a big penalty
  }
  if (!game.videoId) {
    completenessScore -= 15 // Missing video
  }
  if (
    !game.playstationUrlSegment &&
    !game.nintendoUrlSegment &&
    !game.steamUrlSegment
  ) {
    completenessScore -= 20 // No store links
  }
  if (!game.summary || game.summary.length < 50) {
    completenessScore -= 15 // Poor/missing summary
  }

  // 6. Popularity Score (combined rating counts)
  const totalRatingCount = userCount + criticCount
  const popularityScore = Math.log10(totalRatingCount + 1) * 10

  // Combine all scores with weights
  const finalScore =
    userScore * WEIGHTS.userRating +
    criticScore * WEIGHTS.criticRating +
    recencyScore * WEIGHTS.recency +
    hypesScore * WEIGHTS.hypes +
    completenessScore * WEIGHTS.completeness +
    popularityScore * WEIGHTS.popularity

  return finalScore
}

/**
 * Rank games by quality after search
 */
function rankGamesByQuality(games: IGDBGame[]): IGDBGame[] {
  return games
    .map((game) => ({
      ...game,
      qualityScore: calculateQualityScore(game)
    }))
    .sort((a, b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0))
}

/**
 * Transform IGDB platform IDs to Platform enum
 */
function transformIGDBPlatforms(igdbIds: number[]): Platform[] {
  const platformMap: Record<number, Platform> = {
    6: Platform.PC,
    48: Platform.PLAYSTATION,
    167: Platform.PLAYSTATION,
    130: Platform.NINTENDO,
    508: Platform.NINTENDO,
    169: Platform.XBOX
  }

  const platforms = igdbIds.map((id) => platformMap[id]).filter(Boolean)
  return [...new Set(platforms)] // Remove duplicates
}

/**
 * Choose the best video from available videos based on quality ranking
 */
function chooseVideoId(
  videos: { video_id: string; name: string }[] = []
): string | null {
  if (videos.length === 0) {
    return null
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

  const ranked = [...videos].sort((a, b) => {
    const rankA = VIDEO_NAME_RANKING.indexOf(a.name)
    const rankB = VIDEO_NAME_RANKING.indexOf(b.name)
    const safeRankA = rankA === -1 ? Number.MAX_SAFE_INTEGER : rankA
    const safeRankB = rankB === -1 ? Number.MAX_SAFE_INTEGER : rankB
    return safeRankA - safeRankB
  })

  return ranked[0]?.video_id ?? null
}

/**
 * Rank and sort the videos
 */
function sortVideos(
  videos: { video_id: string; name: string }[] = []
): string[] {
  if (videos.length === 0) {
    return []
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

  const ranked = [...videos]
    .sort((a, b) => {
      const rankA = VIDEO_NAME_RANKING.indexOf(a.name)
      const rankB = VIDEO_NAME_RANKING.indexOf(b.name)
      const safeRankA = rankA === -1 ? Number.MAX_SAFE_INTEGER : rankA
      const safeRankB = rankB === -1 ? Number.MAX_SAFE_INTEGER : rankB
      return safeRankA - safeRankB
    })
    .map((video) => video.video_id)

  return ranked
}

/**
 * Extract store URL segments from IGDB websites array
 */
function extractStoreSegments(websites: { type: number; url: string }[]): {
  nintendoUrlSegment: string | null
  playstationUrlSegment: string | null
  steamUrlSegment: string | null
} {
  const nintendo = websites.find((w) => w.type === 24)
  const playstation = websites.find((w) => w.type === 23)
  const steam = websites.find((w) => w.type === 13)

  return {
    nintendoUrlSegment: nintendo ? segmentNintendoURL(nintendo.url) : null,
    playstationUrlSegment: playstation ? segmentPSURL(playstation.url) : null,
    steamUrlSegment: steam ? segmentSteamURL(steam.url) : null
  }
}

// URL segment parsers - keep path structure
function segmentNintendoURL(url: string): string | null {
  // Keep the path structure: games/detail/slug or store/products/slug
  const detailMatch = url.match(/(games\/detail\/[\w-]+)/)
  if (detailMatch) return detailMatch[1]

  const productsMatch = url.match(/(store\/products\/[\w-]+)/)
  if (productsMatch) return productsMatch[1]

  return null
}

function segmentPSURL(url: string): string | null {
  // Keep the path structure: concept/id or product/slug
  const conceptMatch = url.match(/(concept\/\d+)/)
  if (conceptMatch) return conceptMatch[1]

  const productMatch = url.match(/(product\/[\w-]+)/)
  if (productMatch) return productMatch[1]

  return null
}

function segmentSteamURL(url: string): string | null {
  // Keep the path structure: app/id/name
  const match = url.match(/(app\/\d+\/[\w-]+)/)
  if (match) return match[1]

  // Fallback to just app/id
  const simpleMatch = url.match(/(app\/\d+)/)
  return simpleMatch ? simpleMatch[1] : null
}

function transformRawIGDBGame(game: RawIGDBGame): IGDBGame {
  const storeSegments = extractStoreSegments(game.websites || [])

  return {
    id: game.id.toString(),
    igdbId: game.id,
    name: game.name,
    slug: game.slug,
    summary: game.summary || "",
    coverImageId: game.cover?.image_id || "",
    screenshotImageIds: game.screenshots?.map((s) => s.image_id) || [],
    videoId: chooseVideoId(game.videos),
    videoIds: sortVideos(game.videos),
    platforms: transformIGDBPlatforms(game.platforms?.map((p) => p.id) || []),
    firstReleaseDate: game.first_release_date || 0,
    rating: game.rating || null,
    ratingCount: game.rating_count || null,
    aggregatedRating: game.aggregated_rating || null,
    aggregatedRatingCount: game.aggregated_rating_count || null,
    hypes: game.hypes || null,
    ...storeSegments
  }
}

async function fetchIGDBGamesByIds(igdbIds: number[]): Promise<IGDBGame[]> {
  if (igdbIds.length === 0) return []

  const uniqueIds = [...new Set(igdbIds)]
    .filter((id) => Number.isSafeInteger(id) && id > 0)
    .slice(0, 500)

  if (uniqueIds.length === 0) return []

  const rawGames = await queryIGDB<RawIGDBGame[]>(
    IGDB_GAMES_ENDPOINT,
    `
      fields ${IGDB_GAME_FIELDS};

      where id = (${uniqueIds.join(",")})
        & ${IGDB_DISCOVER_WHERE_FILTER};

      limit ${uniqueIds.length};
    `.trim()
  )

  const transformedById = new Map(
    rawGames.map((game) => [game.id, transformRawIGDBGame(game)])
  )

  return uniqueIds
    .map((id) => transformedById.get(id))
    .filter((game): game is IGDBGame => Boolean(game))
}

/**
 * Search IGDB API directly and return ranked results
 */
export async function searchIGDBGamesDirect(
  query: string
): Promise<IGDBGame[]> {
  // Sanitize and limit query length to prevent abuse
  const sanitizedQuery = escapeIGDBString(query).slice(0, 100)
  if (!sanitizedQuery) return []

  try {
    const rawGames = await queryIGDB<RawIGDBGame[]>(
      IGDB_GAMES_ENDPOINT,
      `
        search "${sanitizedQuery}";

        fields ${IGDB_GAME_FIELDS};

        where ${IGDB_DISCOVER_WHERE_FILTER};

        limit 50;
      `.trim()
    )

    const games = rawGames.map(transformRawIGDBGame)

    const rankedGames = rankGamesByQuality(games)

    return rankedGames.slice(0, 30)
  } catch (error) {
    console.error("Error searching IGDB API:", error)
    throw new Error("Failed to search IGDB API")
  }
}

/**
 * Get a single IGDB game by ID
 */
export async function getIGDBGameById(
  igdbId: string
): Promise<IGDBGame | null> {
  const safeIgdbId = parsePositiveIGDBId(igdbId, "igdbId")

  try {
    const games = await queryIGDB<RawIGDBGame[]>(
      IGDB_GAMES_ENDPOINT,
      `
      fields ${IGDB_GAME_FIELDS};

      where id = ${safeIgdbId};
      `.trim()
    )

    if (games.length === 0) return null

    return transformRawIGDBGame(games[0])
  } catch (error) {
    console.error("Error fetching IGDB game by ID:", error)
    throw new Error("Failed to fetch IGDB game")
  }
}

export async function getIGDBMostVisitedGameIds(): Promise<number[]> {
  const rankedGamesPromise = queryIGDB<IGDBPopscore[]>(
    IGDB_POPSCORE_ENDPOINT,
    `
      fields game_id;

      where popularity_type = 1;

      sort value desc;
      limit 500;
    `.trim()
  )
  const { data: rankedGames, error } = await tryCatch(rankedGamesPromise)

  if (error) return []

  return rankedGames.map((game) => game.game_id)
}

export async function getTrendingGames(ids: number[]): Promise<IGDBGame[]> {
  if (ids.length === 0) return []

  const formatedIds = `(${ids.join(", ")})`
  const nowSec = Math.floor(Date.now() / 1000) // today in seconds
  const oneYearAgo = nowSec - 60 * 60 * 24 * 365 // 1 year ago in seconds

  const trending = await queryIGDB<RawIGDBGame[]>(
    IGDB_GAMES_ENDPOINT,
    `
      fields ${IGDB_GAME_FIELDS};

      where id = ${formatedIds}
        & game_type = (0, 2, 3, 8, 9)
        & platforms = (48, 167, 130, 508, 6, 169)
        & first_release_date != null
        & first_release_date <= ${nowSec}
        & first_release_date >= ${oneYearAgo}
        & summary != null
        & cover != null
        & videos != null
        & genres != null
        & themes != (42)
        & keywords != (343, 847, 2509, 3586, 26306);

      limit 500;
    `.trim()
  )

  const trendingById = new Map(trending.map((game) => [game.id, game]))
  const sortedTrending = ids
    .map((id) => trendingById.get(id))
    .filter((game): game is RawIGDBGame => Boolean(game))
    .map(transformRawIGDBGame)

  return sortedTrending
}

export async function getUpcomingGames(ids: number[]): Promise<IGDBGame[]> {
  if (ids.length === 0) return []

  const formatedIds = `(${ids.join(", ")})`
  const nowSec = Math.floor(Date.now() / 1000) // today in seconds

  const upcoming = await queryIGDB<RawIGDBGame[]>(
    IGDB_GAMES_ENDPOINT,
    `
      fields ${IGDB_GAME_FIELDS};

      where id = ${formatedIds}
        & game_type = (0, 2, 3, 8, 9)
        & platforms = (48, 167, 130, 508, 6, 169)
        & first_release_date != null
        & first_release_date >= ${nowSec}
        & summary != null
        & cover != null
        & videos != null
        & genres != null
        & themes != (42)
        & keywords != (343, 847, 2509, 3586, 26306);

      sort first_release_date asc;

      limit 500;
    `.trim()
  )

  return upcoming.map(transformRawIGDBGame)
}

export async function getRecommendedGames(): Promise<{
  upcoming: IGDBGame[]
  trending: IGDBGame[]
}> {
  const { data: ids, error } = await tryCatch(getIGDBMostVisitedGameIds())

  if (error || !ids || ids.length === 0) return { upcoming: [], trending: [] }

  // wait 1 second to avoid rate limit
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { data: trending, error: trendingError } = await tryCatch(
    getTrendingGames(ids)
  )
  if (trendingError)
    console.error("Error fetching trending games:", trendingError)

  // wait 1 second to avoid rate limit
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { data: upcoming, error: upcomingError } = await tryCatch(
    getUpcomingGames(ids)
  )
  if (upcomingError)
    console.error("Error fetching upcoming games:", upcomingError)

  return { trending: trending || [], upcoming: upcoming || [] }
}

export const getCachedSearchIGDBGamesDirect = async (query: string) => {
  return unstable_cache(
    async () => await searchIGDBGamesDirect(query),
    [query],
    {
      tags: [`search-${query}`],
      revalidate: 24 * 60 * 60 // 1 day
    }
  )()
}

export const getCachedIGDBGameById = async (igdbId: string) => {
  return unstable_cache(async () => await getIGDBGameById(igdbId), [igdbId], {
    tags: [`igdb-game-${igdbId}`],
    revalidate: 24 * 60 * 60 // 1 day
  })()
}

export const getCachedRecommendedGames = async () => {
  return unstable_cache(
    async () => await getRecommendedGames(),
    ["igdb-recommended-games"],
    {
      tags: ["igdb-recommended-games"],
      revalidate: false
    }
  )()
}
