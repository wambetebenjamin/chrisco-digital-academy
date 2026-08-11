import "./globals.css"
/*
 * Self-hosted fonts via Fontsource — bundled at build time and served from
 * the same origin. Replaces the render-blocking external Google Fonts CSS
 * (faster first paint, no third-party dependency, CLS-safe).
 */
import "@fontsource/archivo-black/400.css"
import "@fontsource-variable/archivo"
import "@fontsource-variable/inter"
import { AuthProvider } from "./AuthProvider"

export const metadata = {
  title: {
    default: "CHRISCO Digital Academy — Learn Skills That Pay For Life",
    template: "%s | CHRISCO Digital Academy",
  },
  description:
    "A modern learning platform equipping African youth with practical digital skills — design, code, marketing, writing, video and AI. Under CHRISCO Youth Aflame.",
  keywords: [
    "CHRISCO Digital Academy",
    "digital skills Kenya",
    "youth empowerment",
    "online courses Africa",
    "graphic design",
    "web development",
  ],
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
