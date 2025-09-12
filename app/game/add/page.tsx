import { BackButton } from "@/components/layout/BackButton"
import GameForm from "@/components/GameForm"

export default function NewGame() {
  return (
    <div>
      <BackButton className="mb-4" />
      <h1 className="text-2xl font-semibold mb-6">Add Game</h1>
      <GameForm />
    </div>
  )
}
