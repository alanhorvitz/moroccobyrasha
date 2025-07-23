import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Morocco By Rasha - Discover the Magic of Morocco",
  description: "Experience the beauty and culture of Morocco through authentic travel experiences.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
