"use server"

import { buildRequestHeaders } from "@/lib/request"
import { RawIGDBTimeToBeat, TimeToBeat } from "@/types/time-to-beat"
import { unstable_cache } from "next/cache"

const BACKLOGGD_BASE_URL = "https://backloggd.com/games"
const BACKLOGGD_STAT_VALUE_REGEX =
  /<p[^>]*class="[^"]*stat-value[^"]*element-revealed[^"]*"[^>]*>\s*([-\d.,]+)\s*<small>h<\/small>\s*<\/p>[\s\S]{0,220}?<p[^>]*class="[^"]*\blabel\b[^"]*"[^>]*>\s*(average|to finish|to master)\s*<\/p>/gi // god bless ai for regex

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

async function fetchBackloggdTimeToBeat(
  slug: string | null
): Promise<TimeToBeat | null> {
  if (!slug?.trim()) return null

  const encodedSlug = encodeURIComponent(slug.trim())
  const url = `${BACKLOGGD_BASE_URL}/${encodedSlug}/`

  try {
    const response = await fetch(url, {
      headers: buildRequestHeaders({
        kind: "scrape",
        referer: BACKLOGGD_BASE_URL,
        origin: "https://backloggd.com"
      })
    })

    if (response.status === 404) return null

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Backloggd response error (${response.status}): ${errorText}`
      )
    }

    const html = await response.text()
    const parsedHoursByLabel: Partial<
      Record<"average" | "to finish" | "to master", number | null>
    > = {}

    for (const match of html.matchAll(BACKLOGGD_STAT_VALUE_REGEX)) {
      const rawValue = match[1]?.trim()
      const rawLabel = match[2]?.trim().toLowerCase() as
        | "average"
        | "to finish"
        | "to master"
        | undefined

      if (!rawValue || !rawLabel) continue

      // Keep the first instance only to avoid duplicate desktop/mobile rows.
      if (rawLabel in parsedHoursByLabel) continue

      if (rawValue === "-") {
        parsedHoursByLabel[rawLabel] = null
        continue
      }

      const numericValue = Number.parseFloat(rawValue.replace(/,/g, ""))
      parsedHoursByLabel[rawLabel] = Number.isFinite(numericValue)
        ? Math.round(numericValue)
        : null
    }

    const averageHours = parsedHoursByLabel["average"] ?? null
    const toFinishHours = parsedHoursByLabel["to finish"] ?? null
    const toMasterHours = parsedHoursByLabel["to master"] ?? null

    if (
      averageHours === null &&
      toFinishHours === null &&
      toMasterHours === null
    ) {
      return null
    }

    return {
      story: toFinishHours ?? 0,
      extra: averageHours ?? 0,
      complete: toMasterHours ?? 0
    }
  } catch (error) {
    console.error("Error fetching Backloggd time to beat:", error)
    throw error
  }
}

export const getCachedBackloggdTimeToBeat = async (
  slug: string
): Promise<TimeToBeat | null> => {
  const normalizedSlug = slug?.trim().toLowerCase()
  if (!normalizedSlug) return null

  return unstable_cache(
    async () => await fetchBackloggdTimeToBeat(normalizedSlug),
    [normalizedSlug],
    {
      tags: [`backloggd-time-to-beat-${normalizedSlug}`],
      revalidate: 604_800 // 7 days
    }
  )()
}

async function fetchIGDBTimeToBeat(
  igdbGameId: string
): Promise<TimeToBeat | null> {
  if (!igdbGameId) return null

  const CLIENT_ID = process.env.IGDB_CLIENT_ID
  const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

  if (!CLIENT_ID || !ACCESS_TOKEN) {
    throw new Error("IGDB_CLIENT_ID and IGDB_ACCESS_TOKEN must be provided")
  }

  const safeGameId = parsePositiveIGDBId(igdbGameId, "igdbGameId")

  try {
    const response = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
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
      body: `fields *; where game_id = ${safeGameId};`
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`IGDB API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return null
    }

    const timeData = data[0] as RawIGDBTimeToBeat

    return {
      story: timeData.hastily ? Math.round(timeData.hastily / 3600) : 0,
      extra: timeData.normally ? Math.round(timeData.normally / 3600) : 0,
      complete: timeData.completely ? Math.round(timeData.completely / 3600) : 0
    }
  } catch (error) {
    console.error("Error fetching game time to beat:", error)
    throw error
  }
}

export const getCachedIGDBTimeToBeat = async (
  igdbGameId: string
): Promise<TimeToBeat | null> => {
  return unstable_cache(
    async () => await fetchIGDBTimeToBeat(igdbGameId),
    [igdbGameId.toString()],
    {
      tags: [`IGDB-time-to-beat-${igdbGameId}`],
      revalidate: 604_800 // 7 days
    }
  )()
}
