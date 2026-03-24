import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version
  },
  images: {
    minimumCacheTTL: 2_592_000, // 30 days
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
