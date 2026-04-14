import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import LayoutWrapper from "@/components/layout-wrapper"

import { CallProvider } from "@/context/CallContext"
import IncomingCallPopup from "@/components/IncomingCallPopup"
import CallManager from "@/components/call/CallManager"

// ✅ NEW IMPORT (GLOBAL CALL UI)
import GlobalCallUI from "@/components/call/GlobalCallUI"

import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
    title: "CalChat+ | AI Powered Calendar & Chat Assistant",
    description: "Smart productivity platform",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#10b981" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${inter.variable} ${spaceGrotesk.variable}`}
        >
            <body className="flex flex-col min-h-screen font-sans antialiased">

                {/* ✅ GLOBAL CALL CONTEXT */}
                <CallProvider>

                    {/* ⭐ GLOBAL SIGNALR CONNECTION */}
                    <CallManager />

                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>

                        {/* 🔔 TOASTER */}
                        <Toaster />

                        {/* 📞 INCOMING CALL POPUP */}
                        <IncomingCallPopup />

                        {/* 🚀 GLOBAL CALL SCREEN (VERY IMPORTANT) */}
                        <GlobalCallUI />

                    </ThemeProvider>

                </CallProvider>

            </body>
        </html>
    )
}