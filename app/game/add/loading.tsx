import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  FolderCheck,
  Heart,
  Link,
  Save
} from "lucide-react"
import Image from "next/image"

export default function Loading() {
  return (
    <form className="pointer-events-none">
      <div className="sticky top-[68px] flex min-h-[60px] items-center justify-between gap-2 bg-white pb-4">
        <Button type="button" variant="ghost" size="icon">
          <ArrowLeft />
        </Button>
        <Button type="submit">
          <Save />
          Save
        </Button>
      </div>

      <div className="mb-5">
        <label className="text-sm font-semibold" htmlFor="name">
          Game Name <span className="text-xs">*</span>
        </label>
        <Input
          id="name"
          type="text"
          className="mt-2"
          placeholder="e.g. The Last Faith"
        />
      </div>

      <div className="mb-5">
        <label className="text-sm font-semibold" htmlFor="length">
          Game Length (hours)
        </label>
        <Input
          id="length"
          type="number"
          className="mt-2"
          placeholder="e.g. 20"
          min="0"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold" htmlFor="category">
          Category <span className="text-xs">*</span>
        </label>
        <Select value="WISHLIST">
          <SelectTrigger className="mt-2 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WISHLIST">
              <div className="flex items-center gap-2">
                <Heart />
                Wishlist
              </div>
            </SelectItem>
            <SelectItem value="LIBRARY">
              <div className="flex items-center gap-2">
                <FolderCheck />
                Library
              </div>
            </SelectItem>
            <SelectItem value="COMPLETED">
              <div className="flex items-center gap-2">
                <CheckCircle2 />
                Completed
              </div>
            </SelectItem>
            <SelectItem value="ARCHIVED">
              <div className="flex items-center gap-2">
                <Archive />
                Archived
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label
          className="flex items-center gap-2 text-sm font-semibold"
          htmlFor="playstation-url"
        >
          <Image
            src="/logos/playstation.svg"
            alt="PlayStation Logo"
            width={18}
            height={18}
          />
          PlayStation
        </label>
        <div className="mt-2 flex gap-2">
          <Input
            id="playstation-url"
            type="url"
            placeholder="store.playstation.com/en-ca/..."
          />
          <Button
            type="button"
            disabled
            className="w-fit bg-blue-600 hover:bg-blue-700"
          >
            <Link className="h-4 w-4" />{" "}
            <span className="hidden md:block">Link</span>
          </Button>
        </div>
      </div>

      <div>
        <label
          className="flex items-center gap-2 text-sm font-semibold"
          htmlFor="nintendo-url"
        >
          <Image
            src="/logos/nintendo-switch.svg"
            alt="Nintendo Switch Logo"
            width={18}
            height={18}
          />
          Nintendo
        </label>
        <div className="mt-2 flex gap-2">
          <Input
            id="nintendo-url"
            type="url"
            placeholder="www.nintendo.com/en-ca/..."
          />
          <Button type="button" disabled className="w-fit bg-destructive">
            <Link className="h-4 w-4" />{" "}
            <span className="hidden md:block">Link</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
