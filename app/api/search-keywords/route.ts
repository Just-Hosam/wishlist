import { searchKeywordSuggestions } from "@/server/actions/search-keywords"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") ?? ""

  const suggestions = await searchKeywordSuggestions(query)

  return NextResponse.json(suggestions, {
    headers: {
      "Cache-Control": "no-store"
    }
  })
}
