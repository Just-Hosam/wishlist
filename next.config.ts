import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: process.env.npm_package_version
  }
}

export default nextConfig
