import { fetchTimeToBeat, getCachedTimeToBeat } from "@/server/actions/igdb"

interface Props {
  igdbGameId: string
}

export default async function IGDBTimeToBeat({ igdbGameId }: Props) {
  try {
    const timeToBeat = await getCachedTimeToBeat(igdbGameId)

    return (
      <div className="flex items-center gap-4 rounded-3xl border px-4 py-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Story</label>
          <p className="mt-1 text-sm">
            {timeToBeat?.story ? <>{timeToBeat.story} hours</> : "-"}
          </p>
        </div>
        <div className="w-px self-stretch bg-border" />
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Extra</label>
          <p className="mt-1 text-sm">
            {timeToBeat?.extra ? <>{timeToBeat.extra} hours</> : "-"}
          </p>
        </div>
        <div className="w-px self-stretch bg-border" />
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Complete</label>
          <p className="mt-1 text-sm">
            {timeToBeat?.complete ? <>{timeToBeat.complete} hours</> : "-"}
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching Steam game info:", error)
    return (
      <span className="text-sm text-red-600">
        Failed to fetch game information
      </span>
    )
  }
}
