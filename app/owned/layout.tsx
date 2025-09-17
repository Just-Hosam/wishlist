import { FolderCheck } from "lucide-react"

export default function OwnedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <header className="flex justify-between items-center gap-4 pb-6 sticky top-[88px] bg-white">
        <h2 className="flex items-center gap-3 text-2xl">
          <FolderCheck />
          Owned
        </h2>
      </header>
      {children}
    </div>
  )
}
