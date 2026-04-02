import { ExternalLink } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

interface Props {
  story?: number
  extra?: number
  complete?: number
  href?: string
  loading?: boolean
}

export default function TimeToBeat({
  story,
  extra,
  complete,
  href,
  loading
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-2xl bg-card px-5 py-4 shadow-sm"
    >
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
    </a>
  )
}
