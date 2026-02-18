import React from "react"
import type { Metadata, Viewport } from "next"
import { Press_Start_2P } from "next/font/google"
import { PrivyProvider } from "@privy-io/react-auth"

import "./globals.css"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "Regenmon - Tu Mascota Virtual",
  description:
    "Crea y cuida a tu mascota virtual estilo Tamagotchi con estética pixel art retro.",
}

export const viewport: Viewport = {
  themeColor: "#212529",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${pressStart2P.variable} font-sans antialiased`}>
        <PrivyProvider appId="cmkyyrsbj04bck40bidlscndo">
          {children}
        </PrivyProvider>
      </body>
    </html>
  )
}
