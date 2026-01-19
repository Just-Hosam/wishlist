import Footer from "@/components/layout/Footer"
import { headers } from "next/headers"

export default async function FooterWrapper() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) return null

  return <Footer />
}
