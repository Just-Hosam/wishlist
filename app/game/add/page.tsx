import { BackButton } from "@/components/layout/BackButton"
import GameForm from "@/components/GameForm"

export default function NewGame() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h3 className="text-lg font-medium">Add Game</h3>
      </div>
      <GameForm />
    </>
  )
}
