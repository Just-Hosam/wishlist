import Spinner from "@/components/ui/spinner"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playward"
}

export default function Loading() {
  return <Spinner />
}
