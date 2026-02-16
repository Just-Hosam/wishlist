export function normalizePathname(pathname: string) {
  const [pathWithoutQuery] = pathname.split("?")
  const [pathWithoutHash] = pathWithoutQuery.split("#")

  if (pathWithoutHash.length > 1 && pathWithoutHash.endsWith("/")) {
    return pathWithoutHash.slice(0, -1)
  }

  return pathWithoutHash || "/"
}

export function splitPathSegments(pathname: string) {
  return normalizePathname(pathname).split("/").filter(Boolean)
}

export function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

export function encodePathSegment(segment: string) {
  return encodeURIComponent(segment)
}
