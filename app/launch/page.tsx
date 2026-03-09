import Spinner from "@/components/ui/spinner"
import Redirect from "./Redirect"

export default function LaunchPage() {
  return (
    <div className="custom-fade-in flex min-h-[400px] items-center justify-center">
      <Redirect />
      <Spinner className="my-0" />
    </div>
  )
}
