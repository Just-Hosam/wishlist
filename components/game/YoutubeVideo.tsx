"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const YOUTUBE_VIDEO_PLAY_EVENT = "youtube-video-play"

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
  const maxres = `https://i.ytimg.com/vi/${encodedId}/maxresdefault.jpg`
  const hq = `https://i.ytimg.com/vi/${encodedId}/hqdefault.jpg`

  const [thumbnailUrl, setThumbnailUrl] = useState(maxres)
  const [playing, setPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const pauseVideo = () => {
    iframeRef.current?.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "https://www.youtube-nocookie.com"
    )
  }

  useEffect(() => {
    const handleVideoPlay = (event: Event) => {
      const { detail } = event as CustomEvent<string>
      if (detail !== videoId) pauseVideo()
    }

    window.addEventListener(YOUTUBE_VIDEO_PLAY_EVENT, handleVideoPlay)
    return () => {
      window.removeEventListener(YOUTUBE_VIDEO_PLAY_EVENT, handleVideoPlay)
    }
  }, [videoId])

  useEffect(() => {
    if (!playing) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pauseVideo()
        }
      },
      { threshold: 0.1 }
    )
    const el = iframeRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [playing])

  if (playing) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl", className)}>
        <div className="relative aspect-video w-full">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${encodedId}?autoplay=1&enablejsapi=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute h-full w-full"
          />
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      aria-label="Play video"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent<string>(YOUTUBE_VIDEO_PLAY_EVENT, {
            detail: videoId
          })
        )
        setPlaying(true)
      }}
      className={cn(
        "relative block w-full overflow-hidden rounded-2xl text-left",
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
    </button>
  )
}
