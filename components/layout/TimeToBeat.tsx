import { fetchTimeToBeat, getCachedTimeToBeat } from "@/server/actions/igdb"
import { Skeleton } from "../ui/skeleton"

interface Props {
  story?: number
  extra?: number
  complete?: number
  title?: string
  loading?: boolean
}

export default function TimeToBeat({
  story,
  extra,
  complete,
  title,
  loading
}: Props) {
  return (
    <div className="rounded-3xl border px-5 py-4">
      {title && <h4 className="mb-1 text-xs font-bold">{title}</h4>}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Story</label>
          {loading ? (
            <Skeleton className="mt-1 h-5 w-16" />
          ) : (
            <p className="mt-1 text-sm">{story ? <>{story} hours</> : "-"}</p>
          )}
        </div>
        <div className="w-px self-stretch bg-border" />
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Extra</label>
          {loading ? (
            <Skeleton className="mt-1 h-5 w-16" />
          ) : (
            <p className="mt-1 text-sm">{extra ? <>{extra} hours</> : "-"}</p>
          )}
        </div>
        <div className="w-px self-stretch bg-border" />
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Complete</label>
          {loading ? (
            <Skeleton className="mt-1 h-5 w-16" />
          ) : (
            <p className="mt-1 text-sm">
              {complete ? <>{complete} hours</> : "-"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
