/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Quality levels used across the site (Next 16 requires them declared).
    qualities: [75, 78, 80, 82, 84],
  },
  // Long-cache the static course handbooks served from /public
  async headers() {
    return [
      {
        source: "/courses/:slug*.html",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
    ]
  },
}

export default nextConfig
