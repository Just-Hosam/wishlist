import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version
  },
  images: {
    minimumCacheTTL: 10_368_000, // 4 months
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "/igdb/image/upload/**"
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**"
      }
    ]
  }
}

export default nextConfig
