"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const isLandingPage = pathname === "/"

    return (
        <>
            {isLandingPage && <Navbar />}

            <main className="flex-1">
                {children}
            </main>

            {isLandingPage && <Footer />}
        </>
    )
}