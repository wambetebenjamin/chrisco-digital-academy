/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
