import { Search } from "lucide-react"

export default async function SearchPage() {
  return (
    <div className="custom-slide-down-fade-in flex flex-col items-center justify-center pt-20 text-center">
      <Search className="mb-4 h-16 w-16 text-gray-300" />
      <h2 className="mb-2 text-xl font-semibold text-gray-700">
        Search for games
      </h2>
      <p className="text-sm text-gray-500">
        Start typing to find games to track
      </p>
    </div>
  )
}
