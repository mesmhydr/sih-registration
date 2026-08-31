import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Smart India Internal Hackathon 2026 | Vemana Institute of Technology",
  description: "Register your team for the Smart India Internal Hackathon at Vemana Institute of Technology. Team of 6 students required with at least 1 female member.",
  keywords: ["Smart India Hackathon", "SIH", "Vemana Institute of Technology", "Registration", "Hackathon 2026"],
  authors: [{ name: "Vemana Institute of Technology" }],
  openGraph: {
    title: "Smart India Internal Hackathon 2026 | Vemana Institute of Technology",
    description: "Register your team for the Smart India Internal Hackathon",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-brutal-bg text-brutal-text">
        {children}
      </body>
    </html>
  )
}