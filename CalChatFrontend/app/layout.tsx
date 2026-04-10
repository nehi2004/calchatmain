//import React from "react"
//import type { Metadata, Viewport } from "next"
//import { Inter, Space_Grotesk } from "next/font/google"
//import { ThemeProvider } from "@/components/theme-provider"
//import "./globals.css"


//const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
//const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

//export const metadata: Metadata = {
//  title: "CalChat+ | AI Powered Calendar & Chat Assistant",
//  description: "Smart productivity platform for Students, Personal Users, and Working Professionals. Manage your calendar, tasks, and get AI-powered assistance.",
//}

//export const viewport: Viewport = {
//  themeColor: [
//    { media: "(prefers-color-scheme: light)", color: "#10b981" },
//    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
//  ],
//}

//export default function RootLayout({
//  children,
//}: Readonly<{

//  children: React.ReactNode
//}>) {
//  return (
//    <html lang="en" suppressHydrationWarning>
//      <body className="font-sans antialiased" >
//        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//          {children}
//        </ThemeProvider>
//      </body>
//    </html>
//  )
//}








//import React from "react"
//import type { Metadata, Viewport } from "next"
//import { Inter, Space_Grotesk } from "next/font/google"
//import { ThemeProvider } from "@/components/theme-provider"
//import { Toaster } from "@/components/ui/toaster"



//import "./globals.css"

//const inter = Inter({
//    subsets: ["latin"],
//    variable: "--font-inter",
//})

//const spaceGrotesk = Space_Grotesk({
//    subsets: ["latin"],
//    variable: "--font-space-grotesk",
//})

//export const metadata: Metadata = {
//    title: "CalChat+ | AI Powered Calendar & Chat Assistant",
//    description:
//        "Smart productivity platform for Students, Personal Users, and Working Professionals. Manage your calendar, tasks, and get AI-powered assistance.",
//}

//export const viewport: Viewport = {
//    themeColor: [
//        { media: "(prefers-color-scheme: light)", color: "#10b981" },
//        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
//    ],
//}

//export default function RootLayout({
//    children,
//}: {
//    children: React.ReactNode
//}) {
//    return (
//        <html
//            lang="en"
//            suppressHydrationWarning
//            className={`${inter.variable} ${spaceGrotesk.variable}`}
//        >
//            <body
//                suppressHydrationWarning
//                className="font-sans antialiased"
//            >
//                <ThemeProvider
//                attribute="class"
//                defaultTheme="system"
//                enableSystem
//                disableTransitionOnChange
//            >
//                    {children}
//                    <Toaster /> {/* ✅ ADD THIS */}
//                </ThemeProvider>
//            </body>
//        </html>
//    )
//}



//import type { Metadata, Viewport } from "next"
//import { Inter, Space_Grotesk } from "next/font/google"

//import { ThemeProvider } from "@/components/theme-provider"
//import { Toaster } from "@/components/ui/toaster"
//import { Navbar } from "@/components/landing/navbar"
//import { Footer } from "@/components/landing/footer"

//import "./globals.css"

//const inter = Inter({
//    subsets: ["latin"],
//    variable: "--font-inter",
//})

//const spaceGrotesk = Space_Grotesk({
//    subsets: ["latin"],
//    variable: "--font-space-grotesk",
//})

//export const metadata: Metadata = {
//    title: "CalChat+ | AI Powered Calendar & Chat Assistant",
//    description: "Smart productivity platform",
//}

//export const viewport: Viewport = {
//    themeColor: [
//        { media: "(prefers-color-scheme: light)", color: "#10b981" },
//        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
//    ],
//}

////// ✅ IMPORTANT: no custom Props type needed
////export default function RootLayout({
////    children,
////}: {
////    children: React.ReactNode
////}) {
////    return (
////        <html
////            lang="en"
////            className={`${inter.variable} ${spaceGrotesk.variable}`}
////        >
////            <body className="flex flex-col min-h-screen font-sans antialiased">

////                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

////                    {/* NAVBAR */}
////                    <Navbar />

////                    {/* PAGE CONTENT */}
////                    <main className="flex-1">
////                        {children}
////                    </main>

////                    {/* FOOTER */}
////                    <Footer />

////                    <Toaster />

////                </ThemeProvider>

////            </body>
////        </html>
////    )
////}


//export default function RootLayout({
//    children,
//}: {
//    children: React.ReactNode
//}) {
//    return (
//        <html
//            lang="en"
//            className={`${inter.variable} ${spaceGrotesk.variable}`}
//        >
//            <body className="flex flex-col min-h-screen font-sans antialiased">

//                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

//                    {/* ❌ REMOVE NAVBAR + FOOTER FROM HERE */}

//                    <main className="flex-1">
//                        {children}
//                    </main>

//                    <Toaster />

//                </ThemeProvider>

//            </body>
//        </html>
//    )
//}

import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import LayoutWrapper from "@/components/layout-wrapper"

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
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>

                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}