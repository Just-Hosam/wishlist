"use client"

import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

type Props = {
  videoId: string // IGDB video_id (YouTube ID)
  width?: number
  height?: number
  sizes?: string
  className?: string
}

export function YoutubeVideo({
  videoId,
  width = 308,
  height = 173,
  sizes = "(max-width: 640px) 90vw, 308px",
  className
}: Props) {
  const encodedId = encodeURIComponent(videoId)
  const href = `https://youtu.be/${encodedId}`
  const maxres = `https://i.ytimg.com/vi/${encodedId}/maxresdefault.jpg`
  const hq = `https://i.ytimg.com/vi/${encodedId}/hqdefault.jpg`

  const [thumbnailUrl, setThumbnailUrl] = useState(maxres)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Play on YouTube"
      className={cn(
        "relative block overflow-hidden rounded-2xl text-left",
        className
      )}
    >
      <div className="relative grid aspect-video w-full place-items-center">
        <Image
          src={thumbnailUrl}
          alt="YouTube thumbnail"
          width={width}
          height={height}
          sizes={sizes}
          className="absolute h-full w-full object-cover"
          priority={false}
          onError={() => {
            if (thumbnailUrl !== hq) setThumbnailUrl(hq)
          }}
        />
        <Image
          src="/logos/youtube.svg"
          alt="Play on YouTube"
          width={80}
          height={80}
          className="absolute drop-shadow-2xl"
        />
      </div>
    </a>
  )
}
