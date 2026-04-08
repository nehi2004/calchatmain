
//"use client"

//import React, { useState } from "react"
//import { useRouter } from "next/navigation"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//export default function LoginPage() {
//    const router = useRouter()

//    const [email, setEmail] = useState("")
//    const [password, setPassword] = useState("")
//    const [loading, setLoading] = useState(false)

//    async function handleSubmit(e: React.FormEvent) {
//        e.preventDefault()
//        setLoading(true)


//        try {
//            const response = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/account/login", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                },
//                body: JSON.stringify({
//                    email,
//                    password
//                }),
//            })

//            if (!response.ok) {
//                const error = await response.text()
//                alert(error)
//                setLoading(false)
//                return
//            }

//            const data = await response.json()

//            console.log("LOGIN RESPONSE:", data)

//            // ✅ STORE LOGIN DATA
//            localStorage.setItem("token", data.token || "")
//            localStorage.setItem("userId", data.userId || data.id || "")
//            localStorage.setItem("name", data.name || "")
//            localStorage.setItem("role", data.role || "")


//            console.log("Saved userId:", localStorage.getItem("userId"))

//            const roleMap: Record<string, string> = {
//                student: "/dashboard/student",
//                personal: "/dashboard/personal",
//                professional: "/dashboard/professional",
//                hr: "/dashboard/hr",
//                admin: "/dashboard/admin",
//            }

//            router.push(roleMap[data.role] || "/dashboard/student")

//        } catch (error) {
//            console.error(error)
//            alert("Server error")
//        }

//        setLoading(false)
//    }

//    return (
//        <div className="flex min-h-screen items-center justify-center">
//            <div className="w-full max-w-md">
//                <h1 className="text-2xl font-bold">Sign in</h1>

//                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
//                    <div>
//                        <Label>Email</Label>
//                        <Input
//                            type="email"
//                            value={email}
//                            onChange={(e) => setEmail(e.target.value)}
//                            required
//                        />
//                    </div>

//                    <div>
//                        <Label>Password</Label>
//                        <Input
//                            type="password"
//                            value={password}
//                            onChange={(e) => setPassword(e.target.value)}
//                            required
//                        />
//                    </div>

//                    <Button type="submit" disabled={loading}>
//                        {loading ? "Signing in..." : "Sign In"}
//                    </Button>
//                </form>
//            </div>
//        </div>
//    )
//}



"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // 👇 NEW STATE FOR EYE ICON
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("https://steadfast-warmth-production-64c8.up.railway.app/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
           

            if (!response.ok) {
                const error = await response.text()
                alert(error)
                setLoading(false)
                return
            }

            const data = await response.json()

            // ✅ STORE LOGIN DATA
            localStorage.setItem("token", data.token || "")
            localStorage.setItem("userId", data.userId || data.id || "")
            localStorage.setItem("name", data.name || "")
            localStorage.setItem("role", data.role || "")

            const roleMap: Record<string, string> = {
                student: "/dashboard/student",
                personal: "/dashboard/personal",
                professional: "/dashboard/professional",
                hr: "/dashboard/hr",
                admin: "/dashboard/admin",
            }

            const role = (data.role || "").toLowerCase()

            console.log("ROLE:", role)

            router.push(roleMap[role] || "/dashboard/student")

        } catch (error) {
            console.error(error)
            alert("Server error")
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen">

            {/* LEFT SIDE (Same as Register) */}
            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
                <div className="mx-auto max-w-md px-8 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                            <Calendar className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-foreground">Welcome Back 👋</h2>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                        Login to continue your productivity journey with CalChat+
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* MOBILE LOGO */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Calendar className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-xl font-bold text-foreground">CalChat+</span>
                    </div>

                    <h1 className="font-heading text-2xl font-bold text-foreground">Sign in to your account</h1>
                    <p className="mt-2 text-muted-foreground">
                        Don’t have an account?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            Create account
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

                        {/* EMAIL */}
                        <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* PASSWORD WITH EYE */}
                        <div className="flex flex-col gap-2 relative">
                            <Label>Password</Label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* EXTRA OPTIONS */}
                        <div className="flex items-center justify-between text-sm">
                            <Link href="/forgot-password" className="text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* SUBMIT */}
                        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}