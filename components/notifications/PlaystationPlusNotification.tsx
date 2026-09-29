import { formatRelativeDate } from "@/lib/utils"
import { NotificationOutput } from "@/types"
import Image from "next/image"

export default function PlaystationPlusNotification({
  notification
}: {
  notification: NotificationOutput
}) {
  return (
    <li className="flex gap-3 overflow-hidden rounded-3xl bg-card px-5 py-4 shadow-sm">
      <Image
        src="/logos/ps-plus.svg"
        alt="PlayStation Plus logo"
        width={25}
        height={25}
        className="mt-[5px] self-start rounded-sm drop-shadow-2xl"
        unoptimized
      />
      <div>
        <h2 className="text-sm font-semibold">{notification.title}</h2>
        <p className="mt-[2px] text-xs text-muted-foreground">
          {notification.message}
        </p>
        <time
          dateTime={notification.createdAt.toISOString()}
          className="mt-[10px] block text-xs font-light text-muted-foreground"
        >
          {formatRelativeDate(notification.createdAt)}
        </time>
      </div>
    </li>
  )
}
