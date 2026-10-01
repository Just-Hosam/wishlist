import Notification from "@/components/ui/notification"
import { NotificationOutput } from "@/types"
import Image from "next/image"

export default function PSPlusCatalogNotification({
  notification
}: {
  notification: NotificationOutput
}) {
  return (
    <li>
      <a
        href="https://www.subsort.gg/en?xb=0&psp=1&av=av&s=dd"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Notification
          description={notification.message}
          icon={
            <Image
              src="/logos/ps-plus.svg"
              alt="PlayStation Plus logo"
              width={25}
              height={25}
              className="mt-[5px] self-start rounded-sm drop-shadow-2xl"
              unoptimized
            />
          }
          timestamp={notification.createdAt}
          title={notification.title}
        />
      </a>
    </li>
  )
}
