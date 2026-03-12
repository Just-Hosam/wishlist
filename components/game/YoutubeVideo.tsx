"use client"

import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

type Props = {
  videoId: string // IGDB video_id (YouTube ID)
  width?: number
  height?: number
  className?: string
}

export function YoutubeVideo({
  videoId,
  width = 332,
  height = 187,
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
      onClick={(e) => {
        e.preventDefault()
        window.open(href, "_blank", "noopener,noreferrer")
      }}
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
          className="absolute h-full w-full object-cover"
          priority={false}
          unoptimized
          onLoad={(e) => {
            // YouTube returns a 120×90 grey placeholder (not a 404) for missing
            // maxres thumbnails, so onError never fires. Fall back to hq here.
            if (e.currentTarget.naturalWidth <= 120) setThumbnailUrl(hq)
          }}
          onError={() => {
            if (thumbnailUrl !== hq) setThumbnailUrl(hq)
          }}
        />
        <Image
          src="/logos/youtube.svg"
          alt="Play on YouTube"
          width={70}
          height={70}
          className="absolute shadow-2xl"
          unoptimized
        />
      </div>
    </a>
  )
}
