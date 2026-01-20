"use client"

import { Input } from "@/components/ui/input"
import Spinner from "@/components/ui/spinner"
import { searchIGDBGamesDirect } from "@/server/actions/igdb"
import { Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { PageHeader } from "./PageHeader"
import { IGDBGame, Platform } from "@/types"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<IGDBGame[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleFocusSearch = () => {
      inputRef.current?.focus()
    }

    window.addEventListener("focus-search-input", handleFocusSearch)

    return () => {
      window.removeEventListener("focus-search-input", handleFocusSearch)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (query.trim().length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }

    inputRef.current?.blur()

    setIsLoading(true)
    setHasSearched(true)
    try {
      const searchResults = await searchIGDBGamesDirect(query)
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
    setHasSearched(false)
    inputRef.current?.focus()
  }

  const getImageUrl = (imageId: string) => {
    return `https://images.igdb.com/igdb/image/upload/t_720p/${imageId}.jpg`
  }

  const formatReleaseDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  // Empty state - before any search
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center pt-20 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
      <Search className="mb-4 h-16 w-16 text-gray-300" />
      <h2 className="mb-2 text-xl font-semibold text-gray-700">
        Search for games
      </h2>
      <p className="text-sm text-gray-500">
        Start typing to find games to track
      </p>
    </div>
  )

  // Loading state
  const renderLoadingState = () => (
    <div className="duration-1000 animate-in fade-in">
      <Spinner />
    </div>
  )

  // No results state
  const renderNoResultsState = () => (
    <div className="flex flex-col items-center justify-center pt-20 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
      <Search className="mb-4 h-16 w-16 text-gray-300" />
      <h2 className="mb-2 text-xl font-semibold text-gray-700">
        No games found
      </h2>
      <p className="text-sm text-gray-500">
        Try a different search term for "{query}"
      </p>
    </div>
  )

  // Results list
  const renderResults = () => (
    <div className="custom-slide-fade-in grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-4">
      {results.map((game, index) => (
        <Link href={`/search/${game.igdbId}`} passHref key={game.id}>
          <div
            className="flex cursor-pointer flex-col"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards"
            }}
          >
            <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200">
              {game.coverImageId ? (
                <Image
                  src={getImageUrl(game.coverImageId)}
                  alt={game.name}
                  fill
                  className="object-cover"
                  priority={index < 8}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <Search className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Game Info Section */}
            <div className="flex flex-1 flex-col px-1">
              {/* Game Name */}
              <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                {game.name}
              </h3>

              {/* Release Date */}
              {game.firstReleaseDate && (
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {formatReleaseDate(game.firstReleaseDate)}
                </p>
              )}

              {/* Platforms - Show unique platform icons */}
              {(game.steamUrlSegment ||
                game.playstationUrlSegment ||
                game.nintendoUrlSegment) && (
                <div className="mt-3 flex items-center gap-2">
                  {game.steamUrlSegment && (
                    <Image
                      src="/logos/steam.svg"
                      alt="Steam Logo"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.playstationUrlSegment && (
                    <Image
                      src="/logos/playstation.svg"
                      alt="PlayStation Logo"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.nintendoUrlSegment && (
                    <Image
                      src="/logos/nintendo-switch.svg"
                      alt="Nintendo Switch Logo"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.platforms?.includes(Platform.PC) && (
                    <Image
                      src="/logos/windows-10.svg"
                      alt="Windows Logo"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.platforms?.includes(Platform.XBOX) && (
                    <Image
                      src="/logos/xbox.svg"
                      alt="Xbox Logo"
                      width={13}
                      height={13}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader>
        <form onSubmit={handleSubmit} className="relative w-full">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden
            size={16}
          />

          <Input
            ref={inputRef}
            type="text"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for games..."
            className="h-10 rounded-full pl-9 pr-9 transition-all duration-200"
          />

          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-sm text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </form>
      </PageHeader>

      {/* Search Results Area */}
      {!hasSearched && !isLoading && renderEmptyState()}
      {isLoading && renderLoadingState()}
      {hasSearched &&
        !isLoading &&
        results.length === 0 &&
        renderNoResultsState()}
      {hasSearched && !isLoading && results.length > 0 && renderResults()}
    </div>
  )
}
