import Notification from "@/components/ui/notification"
import { NotificationOutput } from "@/types"
import Image from "next/image"

export default function PSPlusMonthlyGamesNotification({
  notification
}: {
  notification: NotificationOutput
}) {
  return (
    <li>
      <a
        href="https://psprices.com/region-ca/collection/ps-plus-monthly?platform=PS5"
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
