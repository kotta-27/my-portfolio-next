import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export', // ← Uncomment for static export (GitHub Pages etc.)
  // metadata は静的なので待つコストが無い。全 UA で <head> に出し、meta description を取りこぼさせない
  htmlLimitedBots: /.*/,
}

export default nextConfig
