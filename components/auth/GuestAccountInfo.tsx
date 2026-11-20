import { TriangleAlert } from "lucide-react"

export function GuestAccountInfo() {
  return (
    <>
      <p>Guest accounts start with sample games and lists.</p>

      <div className="mt-5 rounded-2xl border border-amber-500 bg-amber-50 px-5 py-4 text-sm text-amber-900 text-foreground shadow-sm">
        <header className="flex items-center gap-2">
          <TriangleAlert className="size-[20px] shrink-0" aria-hidden="true" />
          <p className="font-semibold">Changes are temporary</p>
        </header>
        <p className="mt-2 text-sm">
          Add, remove, and organize games freely. Your changes will reset when
          you log out or at the end of the day.
        </p>
      </div>
    </>
  )
}
