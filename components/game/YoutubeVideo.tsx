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

  const sendCommand = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: "" }),
      "https://www.youtube-nocookie.com"
    )
  }

  const pauseVideo = () => sendCommand("pauseVideo")

  const handlePlay = () => {
    window.dispatchEvent(
      new CustomEvent<string>(YOUTUBE_VIDEO_PLAY_EVENT, { detail: videoId })
    )
    // Send playVideo synchronously within the user gesture so iOS WebKit
    // honours it — the iframe is already in the DOM and loaded.
    sendCommand("playVideo")
    setPlaying(true)
  }

  useEffect(() => {
    const handleVideoPlay = (event: Event) => {
      const { detail } = event as CustomEvent<string>
      if (detail !== videoId) pauseVideo()
    }
    window.addEventListener(YOUTUBE_VIDEO_PLAY_EVENT, handleVideoPlay)
    return () =>
      window.removeEventListener(YOUTUBE_VIDEO_PLAY_EVENT, handleVideoPlay)
  }, [videoId])

  useEffect(() => {
    if (!playing) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pauseVideo()
      },
      { threshold: 0.1 }
    )
    const el = iframeRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [playing])

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      {/* Iframe is always in the DOM so iOS has it loaded before the tap */}
      <div className="relative aspect-video w-full">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${encodedId}?autoplay=0&enablejsapi=1&rel=0&iv_load_policy=3&color=white`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute h-full w-full"
        />
      </div>

      {/* Thumbnail overlay — hidden once playing */}
      {!playing && (
        <button
          type="button"
          aria-label="Play video"
          onClick={handlePlay}
          className="absolute inset-0 grid place-items-center"
        >
          <Image
            src={thumbnailUrl}
            alt="YouTube thumbnail"
            width={width}
            height={height}
            className="absolute h-full w-full object-cover"
            priority={false}
            unoptimized
            onLoad={(e) => {
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
        </button>
      )}
    </div>
  )
}
