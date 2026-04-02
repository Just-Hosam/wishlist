import { ExternalLink } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

interface Props {
  story?: number
  extra?: number
  complete?: number
  title?: string
  href?: string
  loading?: boolean
}

export default function TimeToBeat({
  story,
  extra,
  complete,
  title,
  href,
  loading
}: Props) {
  return (
    <div className="rounded-2xl bg-card px-5 py-4 shadow-sm">
      {title &&
        (href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 inline-flex items-center gap-1 text-xs font-bold"
          >
            <span>{title}</span>
            <ExternalLink size={11} strokeWidth={3} className="-mt-[1px]" />
          </a>
        ) : (
          <p className="mb-2 text-xs font-bold">{title}</p>
        ))}
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
