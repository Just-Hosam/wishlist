import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "/igdb/image/upload/**"
      }
    ]
  }
}

export default nextConfig
