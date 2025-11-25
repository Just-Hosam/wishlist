"use server"

import prisma from "@/lib/prisma"
import { Platform } from "@prisma/client"

export interface IGDBSearchResult {
  id: string
  igdbId: number
  name: string
  slug: string
  summary: string
  coverImageId: string
  screenshotImageIds: string[]
  platforms: Platform[]
  firstReleaseDate: number
  rating?: number | null
  ratingCount?: number | null
  aggregatedRating?: number | null
  aggregatedRatingCount?: number | null
  hypes?: number | null
  videoId?: string | null
  similarity?: number // For sorting by relevance
  qualityScore?: number // Computed quality score
}

interface RawSearchResult extends IGDBSearchResult {
  playstationUrlSegment?: string | null
  nintendoUrlSegment?: string | null
  steamUrlSegment?: string | null
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
function calculateQualityScore(game: RawSearchResult): number {
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
    similarity: 0.2, // Text similarity to search query
    userRating: 0.25, // User ratings (Bayesian average)
    criticRating: 0.15, // Critic ratings (Bayesian average)
    recency: 0.2, // Recent/upcoming releases get strong boost
    hypes: 0.12, // Community hype (important for new games)
    completeness: 0.05, // Has screenshots, videos, store links
    popularity: 0.03 // Combined rating counts
  }

  // 1. Similarity Score (how well the name matches the query)
  const similarityScore = (game.similarity ?? 0) * 100

  // 2. User Rating Score (Bayesian average)
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

  // 3. Critic Rating Score (Bayesian average)
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

  // 4. Recency Score
  const recencyScore = calculateRecencyWeight(game.firstReleaseDate) * 100

  // 5. Hypes Score (stronger for highly anticipated games)
  // Use square root of log to give more weight to higher hype counts
  const hypesScore = game.hypes ? Math.sqrt(Math.log10(game.hypes + 1)) * 35 : 0

  // 6. Completeness Score (penalize games missing key properties)
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

  // 7. Popularity Score (combined rating counts)
  const totalRatingCount = userCount + criticCount
  const popularityScore = Math.log10(totalRatingCount + 1) * 10

  // Combine all scores with weights
  const finalScore =
    similarityScore * WEIGHTS.similarity +
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
function rankGamesByQuality(games: RawSearchResult[]): IGDBSearchResult[] {
  return games
    .map((game) => ({
      ...game,
      qualityScore: calculateQualityScore(game)
    }))
    .sort((a, b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0))
    .map(
      ({
        playstationUrlSegment,
        nintendoUrlSegment,
        steamUrlSegment,
        ...game
      }) => game
    )
}

/**
 * Search IGDB games using PostgreSQL's pg_trgm extension for fuzzy text matching.
 *
 * @param query - The search query string
 * @param limit - Maximum number of results to return (default: 15)
 * @returns Array of matching IGDB games sorted by relevance and quality
 */
export async function searchIGDBGames(
  query: string,
  limit: number = 15
): Promise<IGDBSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const searchQuery = query.trim()

  try {
    // Step 1: Fetch top 50 search results based on text matching
    // This casts a wide net to ensure we capture all relevant games
    const searchResults = await prisma.$queryRaw<RawSearchResult[]>`
      SELECT 
        id,
        "igdbId",
        name,
        slug,
        summary,
        "coverImageId",
        "screenshotImageIds",
        "videoId",
        platforms,
        "firstReleaseDate",
        rating,
        "ratingCount",
        "aggregatedRating",
        "aggregatedRatingCount",
        hypes,
        "playstationUrlSegment",
        "nintendoUrlSegment",
        "steamUrlSegment",
        similarity(name, ${searchQuery}) as similarity
      FROM "IGDBGame"
      WHERE 
        similarity(name, ${searchQuery}) > 0.3
        OR name ILIKE ${`%${searchQuery}%`}
        OR slug ILIKE ${`%${searchQuery}%`}
        OR ${searchQuery} = ANY("alternativeNames")
      ORDER BY 
        -- Exact match gets highest priority
        CASE WHEN LOWER(name) = LOWER(${searchQuery}) THEN 0 ELSE 1 END,
        -- Starts with query gets second priority
        CASE WHEN LOWER(name) LIKE LOWER(${searchQuery + "%"}) THEN 0 ELSE 1 END,
        -- Word boundary match (e.g., "zelda" in "The Legend of Zelda")
        CASE WHEN LOWER(name) LIKE LOWER(${"% " + searchQuery + "%"}) THEN 0 ELSE 1 END,
        -- Then by similarity score
        similarity(name, ${searchQuery}) DESC,
        -- Finally by basic popularity for tie-breaking
        "ratingCount" DESC NULLS LAST,
        rating DESC NULLS LAST
      LIMIT 50
    `

    // Step 2: Rank the top 50 by quality score and return top {limit} results
    const rankedResults = rankGamesByQuality(searchResults)

    return rankedResults.slice(0, limit)
  } catch (error) {
    console.error("Error searching IGDB games:", error)
    throw new Error("Failed to search IGDB games")
  }
}

export interface GameTimeToBeat {
  normallyHours: number
}

export async function fetchGameTimeToBeats(
  igdbGameId: string
): Promise<GameTimeToBeat | null> {
  const CLIENT_ID = process.env.IGDB_CLIENT_ID
  const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

  if (!CLIENT_ID || !ACCESS_TOKEN) {
    throw new Error("IGDB_CLIENT_ID and IGDB_ACCESS_TOKEN must be provided")
  }

  try {
    const response = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain"
      },
      body: `fields *; where game_id = ${igdbGameId};`
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`IGDB API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return null
    }

    const timeData = data[0]

    const normallyHours = timeData.normally
      ? Math.round(timeData.normally / 3600)
      : 0

    return {
      normallyHours
    }
  } catch (error) {
    console.error("Error fetching game time to beat:", error)
    throw error
  }
}
