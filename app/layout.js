import "./globals.css"
import { AuthProvider } from "./AuthProvider"

export const metadata = {
  title: "CHRISCO Digital Academy",
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
