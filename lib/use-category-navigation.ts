import { useRouter } from "next/navigation"
import { useTabContext } from "@/contexts/TabContext"

/**
 * Hook for navigating to the appropriate route based on the active tab
 */
export function useCategoryNavigation() {
  const router = useRouter()
  const { activeTab } = useTabContext()

  const navigateToActiveTab = () => {
    const routes = {
      WISHLIST: "/wishlist",
      LIBRARY: "/library",
      MORE: "/more/completed"
    } as const

    router.push(routes[activeTab as keyof typeof routes] || "/")
  }

  return { navigateToActiveTab }
}
