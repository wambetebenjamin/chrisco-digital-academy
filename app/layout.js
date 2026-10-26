import "./globals.css"
import "@fontsource/archivo-black/400.css"
import "@fontsource-variable/archivo"
import "@fontsource-variable/inter"
import { AuthProvider } from "./AuthProvider"
import { resolveServerOrigin, buildSocialMetadata } from "./lib/siteOrigin"

export async function generateMetadata() {
  const origin = await resolveServerOrigin()
  const baseMeta = buildSocialMetadata({
    origin,
    title: "CHRISCO Digital Academy · Learn Practical Skills That Pay For Life",
    description:
      "Equipping African youth with 19 practical digital skills courses, Christian study books, certificates, and Dashboard e-book access under CHRISCO Youth Aflame.",
    path: "/",
    bannerPath: "/og/default.jpg",
  })

  return {
    ...baseMeta,
    title: {
      default: "CHRISCO Digital Academy · Learn Skills That Pay For Life",
      template: "%s | CHRISCO Digital Academy",
    },
    keywords: [
      "CHRISCO Digital Academy",
      "CHRISCO Youth Aflame",
      "digital skills Africa",
      "Christian youth books",
      "economic empowerment",
      "personal branding",
      "AI literacy",
      "online courses Africa",
    ],
  }
}

export const viewport = {
  themeColor: "#002333",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
