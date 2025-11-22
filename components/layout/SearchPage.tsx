"use client"

import { searchIGDBGames, type IGDBSearchResult } from "@/server/actions/igdb"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/layout/BackButton"
import Spinner from "@/components/ui/spinner"
import { X, Search } from "lucide-react"
import { Platform } from "@prisma/client"
import Image from "next/image"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<IGDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Set new timeout
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setHasSearched(true)
      try {
        const searchResults = await searchIGDBGames(query, 20)
        setResults(searchResults)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 700) // 700ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
    setHasSearched(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur()
    }
  }

  const getImageUrl = (imageId: string) => {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`
  }

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case Platform.NINTENDO:
        return "/logos/nintendo-switch.svg"
      case Platform.PLAYSTATION:
        return "/logos/playstation.svg"
      case Platform.XBOX:
        return "/logos/xbox.svg"
      case Platform.PC:
        return "/logos/windows-10.svg"
      default:
        return null
    }
  }

  const getPlatformAlt = (platform: Platform) => {
    switch (platform) {
      case Platform.NINTENDO:
        return "Nintendo Switch"
      case Platform.PLAYSTATION:
        return "PlayStation"
      case Platform.XBOX:
        return "Xbox"
      case Platform.PC:
        return "PC"
      default:
        return platform
    }
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
    <div className="flex flex-col items-center justify-center py-12 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
      <Search className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
        Search for games
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Start typing to find games to track
      </p>
    </div>
  )

  // Loading state
  const renderLoadingState = () => (
    <div className="duration-1000 animate-in fade-in">
      <Spinner className="my-16" />
    </div>
  )

  // No results state
  const renderNoResultsState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
      <Search className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
        No games found
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Try a different search term for "{query}"
      </p>
    </div>
  )

  // Results list
  const renderResults = () => (
    <div>
      {results.map((game, index) => (
        <div key={game.id}>
          <div
            className="mx-[-24px] flex cursor-pointer gap-4 border-gray-200 px-[24px] py-5 transition-all duration-500 animate-in fade-in slide-in-from-top-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800/50"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards"
            }}
          >
            {/* Cover Image */}
            <div className="h-[104px] w-[78px] flex-shrink-0 overflow-hidden rounded-md bg-gray-200 shadow-lg dark:bg-gray-700">
              {game.coverImageId ? (
                <Image
                  src={getImageUrl(game.coverImageId)}
                  alt={game.name}
                  width={78}
                  height={104}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <Search className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Game Info */}
            <div className="flex flex-1 flex-col">
              <h3 className="mb-1 line-clamp-2 font-semibold text-gray-900 dark:text-gray-100">
                {game.name}
              </h3>

              {/* Release Date */}
              {game.firstReleaseDate && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatReleaseDate(game.firstReleaseDate)}
                </p>
              )}

              {/* Platforms - Show unique platform icons */}
              {game.platforms && game.platforms.length > 0 && (
                <div className="mt-auto flex items-center gap-2">
                  {[...new Set(game.platforms)].map((platform, idx) => {
                    const icon = getPlatformIcon(platform)
                    return icon ? (
                      <Image
                        key={idx}
                        src={icon}
                        alt={getPlatformAlt(platform)}
                        width={13}
                        height={13}
                      />
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mx-[-24px] rounded-full border-[0.5px] px-[24px]"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <div className="sticky top-[68px] z-40 mx-[-24px] flex min-h-[60px] items-center gap-3 bg-white px-[24px] pb-4 duration-500 animate-in fade-in slide-in-from-top-3 dark:bg-slate-900/75">
        <BackButton />

        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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
            onKeyDown={handleKeyDown}
            placeholder="Search for games..."
            className="h-10 rounded-full pl-9 pr-9 transition-all duration-200"
          />

          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-sm text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

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
