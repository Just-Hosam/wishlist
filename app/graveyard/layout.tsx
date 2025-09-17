import { Skull } from "lucide-react"

export default function GraveyardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <header className="flex justify-between items-center gap-4 pb-6 sticky top-[88px] bg-white">
        <h2 className="flex items-center gap-3 text-2xl">
          <Skull />
          Graveyard
        </h2>
      </header>
      {children}
    </div>
  )
}
