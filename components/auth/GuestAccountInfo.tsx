import { TriangleAlert } from "lucide-react"

export function GuestAccountInfo() {
  return (
    <div className="rounded-2xl border border-amber-500 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm">
      <header className="flex items-center gap-2">
        <TriangleAlert className="size-[22px] shrink-0" aria-hidden="true" />
        <p className="text-base font-semibold">Guest accounts</p>
      </header>
      <ul className="mt-4 list-disc space-y-4 pl-5">
        <li>
          <strong className="text-sm font-semibold">
            Changes are temporary
          </strong>
          <p className="mt-1">
            Your changes will reset when you log out or at the end of the day.
          </p>
        </li>
        <li>
          <strong className="font-semibold">Prepopulated with games</strong>
          <p className="mt-1">
            Guest accounts start with sample games and lists.
          </p>
        </li>
      </ul>
    </div>
  )
}
