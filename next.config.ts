import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export', // ← Uncomment for static export (GitHub Pages etc.)
  // metadata は静的なので待つコストが無い。全 UA で <head> に出し、meta description を取りこぼさせない
  htmlLimitedBots: /.*/,
  images: {
    // Zenn の OG 画像（970×630）を表示サイズに縮めて配信する
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/zenn/**' }],
  },
}

export default nextConfig
