type RequestKind = "api" | "scrape"

interface BuildRequestHeadersOptions {
  kind?: RequestKind
  headers?: HeadersInit
  referer?: string
  origin?: string
}

const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15"
] as const

const ACCEPT_LANGUAGES = [
  "en-US,en;q=0.9",
  "en-CA,en;q=0.9",
  "en-US,en;q=0.8,fr-CA;q=0.6",
  "en-GB,en;q=0.9"
] as const

const pickRandom = <T>(values: readonly T[]): T => {
  const index = Math.floor(Math.random() * values.length)
  return values[index]
}

export function getRandomUserAgent(): string {
  return pickRandom(USER_AGENTS)
}

export function buildRequestHeaders(
  options: BuildRequestHeadersOptions = {}
): Record<string, string> {
  const kind = options.kind ?? "api"
  const headers = new Headers({
    accept:
      kind === "scrape"
        ? "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        : "application/json,text/plain,*/*",
    "accept-language": pickRandom(ACCEPT_LANGUAGES),
    "accept-encoding": "gzip, deflate, br",
    connection: "keep-alive",
    "user-agent": getRandomUserAgent()
  })

  if (kind === "scrape") {
    headers.set("upgrade-insecure-requests", "1")
    headers.set("sec-fetch-dest", "document")
    headers.set("sec-fetch-mode", "navigate")
    headers.set("sec-fetch-site", "none")
  }

  if (options.referer) headers.set("referer", options.referer)
  if (options.origin) headers.set("origin", options.origin)

  if (options.headers) {
    const customHeaders = new Headers(options.headers)
    customHeaders.forEach((value, key) => headers.set(key, value))
  }

  return Object.fromEntries(headers.entries())
}
