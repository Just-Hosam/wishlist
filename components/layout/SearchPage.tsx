"use client"

import { BackButton } from "@/components/layout/BackButton"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/ui/spinner"
import { searchIGDBGames, type IGDBSearchResult } from "@/server/actions/igdb"
import { Platform } from "@prisma/client"
import { Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<IGDBSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (query.trim().length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }

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
  }

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
    setHasSearched(false)
    inputRef.current?.focus()
  }

  const getImageUrl = (imageId: string) => {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`
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
        <Link href={`/game/${game.igdbId}/add`} passHref key={game.id}>
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
                <div className="mt-auto flex items-center gap-2 pb-1">
                  {game.platforms.includes(Platform.PLAYSTATION) && (
                    <Image
                      src="/logos/playstation.svg"
                      alt="PlayStation"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.platforms.includes(Platform.NINTENDO) && (
                    <Image
                      src="/logos/nintendo-switch.svg"
                      alt="Nintendo Switch"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.platforms.includes(Platform.PC) && (
                    <Image
                      src="/logos/windows-10.svg"
                      alt="PC"
                      width={13}
                      height={13}
                    />
                  )}
                  {game.platforms.includes(Platform.XBOX) && (
                    <Image
                      src="/logos/xbox.svg"
                      alt="Xbox"
                      width={13}
                      height={13}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mx-[-24px] rounded-full border-[0.5px] px-[24px]"></div>
        </Link>
      ))}
    </div>
  )

  return (
    <div>
      <div className="sticky top-[68px] z-40 mx-[-24px] flex min-h-[60px] items-center gap-3 bg-white px-[24px] pb-4 duration-500 animate-in fade-in slide-in-from-top-3 dark:bg-slate-900/75">
        <BackButton />

        <form onSubmit={handleSubmit} className="relative flex-1">
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
