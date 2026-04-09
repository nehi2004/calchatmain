//"use client"

//import Link from "next/link"
//import { Calendar, Menu, X } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import { useState } from "react"

//export function Navbar() {
//  const [mobileOpen, setMobileOpen] = useState(false)

//  return (
//    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
//      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
//        <Link href="/" className="flex items-center gap-2">
//          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//            <Calendar className="h-5 w-5 text-primary-foreground" />
//          </div>
//          <span className="font-heading text-xl font-bold text-foreground">CalChat+</span>
//        </Link>

//        <nav className="hidden items-center gap-8 md:flex">
//          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
//            Features
//          </Link>
//          <Link href="#roles" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
//            For You
//          </Link>
//          <Link href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
//            About
//          </Link>
//        </nav>

//        <div className="hidden items-center gap-3 md:flex">
//          <ThemeToggle />
//          <Button variant="ghost" asChild>
//            <Link href="/login">Login</Link>
//          </Button>
//          <Button asChild>
//            <Link href="/register">Get Started</Link>
//          </Button>
//        </div>

//        <div className="flex items-center gap-2 md:hidden">
//          <ThemeToggle />
//          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
//            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//          </Button>
//        </div>
//      </div>

//      {mobileOpen && (
//        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
//          <nav className="flex flex-col gap-3">
//            <Link href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
//              Features
//            </Link>
//            <Link href="#roles" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
//              For You
//            </Link>
//            <Link href="#about" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
//              About
//            </Link>
//            <div className="flex gap-3 pt-2">
//              <Button variant="ghost" className="flex-1" asChild>
//                <Link href="/login">Login</Link>
//              </Button>
//              <Button className="flex-1" asChild>
//                <Link href="/register">Get Started</Link>
//              </Button>
//            </div>
//          </nav>
//        </div>
//      )}
//    </header>
//  )
//}




//"use client"

//import Link from "next/link"
//import { Calendar, Menu, X } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { ThemeToggle } from "@/components/theme-toggle"
//import { useState } from "react"
//import { motion, AnimatePresence } from "framer-motion"

//export function Navbar() {
//    const [mobileOpen, setMobileOpen] = useState(false)

//    return (
//        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl shadow-sm">

//            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">

//                {/* 🔥 LOGO */}
//                <Link href="/" className="flex items-center gap-3 group">
//                    <div className="flex h-10 w-10 items-center justify-center rounded-xl 
//          bg-gradient-to-tr from-blue-600 to-indigo-600 
//          shadow-md group-hover:scale-105 transition">
//                        <Calendar className="h-5 w-5 text-white" />
//                    </div>

//                    <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
//                        CalChat+
//                    </span>
//                </Link>

//                {/* 🔹 NAV LINKS */}
//                <nav className="hidden md:flex items-center gap-8">
//                    {["Features", "For You", "About"].map((item, i) => (
//                        <Link
//                            key={i}
//                            href={`#${item.toLowerCase().replace(" ", "")}`}
//                            className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
//                        >
//                            {item}
//                            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
//                        </Link>
//                    ))}
//                </nav>

//                {/* 🔥 RIGHT SIDE */}
//                <div className="hidden md:flex items-center gap-3">

//                    <ThemeToggle />

//                    {/* LOGIN BUTTON */}
//                    <Button
//                        variant="ghost"
//                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
//                        asChild
//                    >
//                        <Link href="/login">Login</Link>
//                    </Button>

//                    {/* GET STARTED BUTTON */}
//                    <Button
//                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
//            hover:from-blue-700 hover:to-indigo-700 
//            shadow-md hover:shadow-lg transition-all"
//                        asChild
//                    >
//                        <Link href="/register">Get Started</Link>
//                    </Button>

//                </div>

//                {/* 🔹 MOBILE MENU BUTTON */}
//                <div className="flex items-center gap-2 md:hidden">
//                    <ThemeToggle />

//                    <Button
//                        variant="ghost"
//                        size="icon"
//                        onClick={() => setMobileOpen(!mobileOpen)}
//                    >
//                        {mobileOpen ? <X /> : <Menu />}
//                    </Button>
//                </div>
//            </div>

//            {/* 🔥 MOBILE MENU WITH ANIMATION */}
//            <AnimatePresence>
//                {mobileOpen && (
//                    <motion.div
//                        initial={{ opacity: 0, y: -20 }}
//                        animate={{ opacity: 1, y: 0 }}
//                        exit={{ opacity: 0, y: -20 }}
//                        transition={{ duration: 0.3 }}
//                        className="md:hidden border-t border-white/10 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl px-4 py-5"
//                    >
//                        <nav className="flex flex-col gap-4">

//                            {["Features", "For You", "About"].map((item, i) => (
//                                <Link
//                                    key={i}
//                                    href={`#${item.toLowerCase().replace(" ", "")}`}
//                                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
//                                    onClick={() => setMobileOpen(false)}
//                                >
//                                    {item}
//                                </Link>
//                            ))}

//                            <div className="flex gap-3 pt-4">

//                                <Button
//                                    className="flex-1 border border-blue-500 text-blue-600 
//                  hover:bg-blue-600 hover:text-white transition"
//                                    asChild
//                                >
//                                    <Link href="/login">Login</Link>
//                                </Button>

//                                <Button
//                                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
//                                    asChild
//                                >
//                                    <Link href="/register">Get Started</Link>
//                                </Button>

//                            </div>

//                        </nav>
//                    </motion.div>
//                )}
//            </AnimatePresence>

//        </header>
//    )
//}


"use client"

import Link from "next/link"
import { Calendar, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    const navLink =
        "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl shadow-sm">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">

                {/* 🔥 LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl 
            bg-gradient-to-tr from-blue-600 to-indigo-600 
            shadow-md group-hover:scale-105 transition">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
                        CalChat+
                    </span>
                </Link>

                {/* 🔹 NAV LINKS */}
                <nav className="hidden md:flex items-center gap-8">

                    {/* Landing Page Scroll */}
                    {/*<Link href="#features" className={navLink}>Features</Link>*/}
                    {/*<Link href="#roles" className={navLink}>For You</Link>*/}
                    <Link href="/#features" className={navLink}>Features</Link>
                    <Link href="/#roles" className={navLink}>For You</Link>


                    {/* Pages */}
                    <Link href="/about" className={navLink}>About</Link>
                    <Link href="/contact" className={navLink}>Contact</Link>
                    <Link href="/privacy" className={navLink}>Privacy</Link>
                    <Link href="/terms" className={navLink}>Terms</Link>

                </nav>

                {/* 🔥 RIGHT SIDE */}
                <div className="hidden md:flex items-center gap-3">

                    <ThemeToggle />

                    <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600" asChild>
                        <Link href="/login">Login</Link>
                    </Button>

                    <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            hover:from-blue-700 hover:to-indigo-700 
            shadow-md hover:shadow-lg transition-all"
                        asChild
                    >
                        <Link href="/register">Get Started</Link>
                    </Button>

                </div>

                {/* 🔹 MOBILE BUTTON */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </Button>
                </div>

            </div>

            {/* 🔥 MOBILE MENU */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden border-t border-white/10 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl px-4 py-5"
                    >
                        <nav className="flex flex-col gap-4">

                            {/* Landing */}
                            <Link href="#features" onClick={() => setMobileOpen(false)}>Features</Link>
                            <Link href="#roles" onClick={() => setMobileOpen(false)}>For You</Link>

                            {/* Pages */}
                            <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
                            <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
                            <Link href="/privacy" onClick={() => setMobileOpen(false)}>Privacy</Link>
                            <Link href="/terms" onClick={() => setMobileOpen(false)}>Terms</Link>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">

                                <Button className="flex-1 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>

                                <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700" asChild>
                                    <Link href="/register">Get Started</Link>
                                </Button>

                            </div>

                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    )
}