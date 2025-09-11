"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CircleCheckBig,
  FolderCheck,
  PlusIcon,
  ScrollText,
  Skull,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useActiveTab } from "@/lib/hooks/useActiveTab"

export default function AddGameButton() {
  const activeTab = useActiveTab()

  return (
    <Link href={`game/add?category=${activeTab}`}>
      <Button size="icon">
        <PlusIcon />
      </Button>
    </Link>
  )
}
