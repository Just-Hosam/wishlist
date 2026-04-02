"use server"

import { buildRequestHeaders } from "@/lib/request"
import {
  HLTBSearchPayload,
  RawHLTBSearchResponse,
  RawHLTBTokenResponse
} from "@/types/hltb"
import { TimeToBeat } from "@/types/time-to-beat"
import { unstable_cache } from "next/cache"

const HLTB_BASE_URL = "https://howlongtobeat.com"
const HLTB_SEARCH_URL = `${HLTB_BASE_URL}/?q=`
const HLTB_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
const HLTB_ACCEPT_LANGUAGE = "en-US,en;q=0.9"

interface FindAuth {
  token: string | null
  hpKey: string | null
  hpVal: string | null
}

interface DiscoveredFindRoutes {
  initPath: string
  searchPath: string
}

function buildHLTBHeaders(
  options: Parameters<typeof buildRequestHeaders>[0] = {}
): Record<string, string> {
  return buildRequestHeaders({
    ...options,
    headers: {
      "user-agent": HLTB_USER_AGENT,
      "accept-language": HLTB_ACCEPT_LANGUAGE,
      ...options.headers
    }
  })
}

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

function buildSearchPayload(name: string): HLTBSearchPayload {
  return {
    searchType: "games",
    searchTerms: normalizeName(name).split(" ").filter(Boolean),
    searchPage: 1,
    size: 20,
    searchOptions: {
      games: {
        userId: 0,
        platform: "",
        sortCategory: "popular",
        rangeCategory: "main",
        rangeTime: {
          min: null,
          max: null
        },
        gameplay: {
          perspective: "",
          flow: "",
          genre: "",
          difficulty: ""
        },
        rangeYear: {
          min: "",
          max: ""
        },
        modifier: ""
      },
      users: {
        sortCategory: "postcount"
      },
      lists: {
        sortCategory: "follows"
      },
      filter: "",
      sort: 0,
      randomizer: 0
    },
    useCache: true
  }
}

async function fetchFindAuth(routes: DiscoveredFindRoutes): Promise<FindAuth> {
  const response = await fetch(
    `${HLTB_BASE_URL}${routes.initPath}?t=${Date.now()}`,
    {
      headers: buildHLTBHeaders({
        headers: {
          Accept: "*/*"
        },
        referer: HLTB_SEARCH_URL
      })
    }
  )

  if (!response.ok) {
    return {
      token: null,
      hpKey: null,
      hpVal: null
    }
  }

  const data = (await response.json()) as RawHLTBTokenResponse

  return {
    token: data.token?.trim() || null,
    hpKey: data.hpKey?.trim() || null,
    hpVal: data.hpVal?.trim() || null
  }
}

async function discoverFindRoutes(
  normalizedName: string
): Promise<DiscoveredFindRoutes | null> {
  const response = await fetch(
    `${HLTB_SEARCH_URL}${encodeURIComponent(normalizedName)}`,
    {
      headers: buildHLTBHeaders({
        kind: "scrape",
        referer: HLTB_BASE_URL,
        origin: HLTB_BASE_URL
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `HLTB search page response error (${response.status}): ${errorText}`
    )
  }

  const html = await response.text()
  const chunkPaths = [
    ...new Set(html.match(/\/_next\/static\/chunks\/[^"]+?\.js/g) ?? [])
  ]

  for (const chunkPath of chunkPaths) {
    try {
      const chunkResponse = await fetch(`${HLTB_BASE_URL}${chunkPath}`, {
        headers: buildHLTBHeaders({
          headers: {
            Accept: "*/*"
          },
          referer: `${HLTB_SEARCH_URL}${encodeURIComponent(normalizedName)}`
        })
      })

      if (!chunkResponse.ok) continue

      const bundleSource = await chunkResponse.text()
      if (!bundleSource.includes("searchTerms")) continue

      const initPath = bundleSource.match(/\/api\/[A-Za-z0-9/_-]+\/init\b/)?.[0]
      if (!initPath) continue

      return {
        initPath,
        searchPath: initPath.replace(/\/init$/, "")
      }
    } catch (error) {
      console.error("Error inspecting HLTB bundle chunk:", error)
    }
  }

  return null
}

async function fetchHLTBTimeToBeat(name: string): Promise<TimeToBeat | null> {
  const normalizedName = normalizeName(name)
  if (!normalizedName) return null

  const routes = await discoverFindRoutes(normalizedName)
  if (!routes) return null

  const { token, hpKey, hpVal } = await fetchFindAuth(routes)
  const payload = buildSearchPayload(normalizedName)
  const searchPayload =
    hpKey && hpVal ? { ...payload, [hpKey]: hpVal } : payload

  const response = await fetch(`${HLTB_BASE_URL}${routes.searchPath}`, {
    method: "POST",
    headers: buildHLTBHeaders({
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        ...(token ? { "x-auth-token": token } : {}),
        ...(hpKey ? { "x-hp-key": hpKey } : {}),
        ...(hpVal ? { "x-hp-val": hpVal } : {}),
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      origin: HLTB_BASE_URL,
      referer: `${HLTB_BASE_URL}/`
    }),
    body: JSON.stringify(searchPayload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `HLTB discovered route response error (${response.status}): ${errorText}`
    )
  }

  const data = (await response.json()) as RawHLTBSearchResponse
  const result = data.data?.[0]

  if (!result) return null

  return {
    story: Math.round((result.comp_main ?? 0) / 3600),
    extra: Math.round((result.comp_plus ?? 0) / 3600),
    complete: Math.round((result.comp_100 ?? 0) / 3600)
  }
}

export const getCachedHLTBTimeToBeat = async (
  name: string
): Promise<TimeToBeat | null> => {
  const normalizedName = normalizeName(name)
  if (!normalizedName) return null

  return unstable_cache(
    async () => await fetchHLTBTimeToBeat(normalizedName),
    [normalizedName],
    {
      tags: [`hltb-time-to-beat-${normalizedName}`],
      revalidate: 259200 // 3 days
    }
  )()
}
