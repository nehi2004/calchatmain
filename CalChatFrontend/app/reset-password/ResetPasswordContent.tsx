//"use client"

//import React, { useState } from "react"
//import { useSearchParams, useRouter } from "next/navigation"
//import Link from "next/link"
//import { Calendar, Eye, EyeOff } from "lucide-react"
//import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"

//export default function ResetPasswordContent() {
//    const params = useSearchParams()
//    const router = useRouter()
//    const token = params.get("token")

//    const [password, setPassword] = useState("")
//    const [confirmPassword, setConfirmPassword] = useState("")
//    const [showPassword, setShowPassword] = useState(false)
//    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//    const [loading, setLoading] = useState(false)

//    async function handleSubmit(e: React.FormEvent) {
//        e.preventDefault()

//        if (password !== confirmPassword) {
//            alert("Passwords do not match")
//            return
//        }

//        setLoading(true)

//        try {
//            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/account/reset-password", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json"
//                },
//                body: JSON.stringify({
//                    token,
//                    newPassword: password
//                })
//            })

//            const msg = await res.text()

//            if (!res.ok) {
//                alert(msg || "Error occurred")
//                return
//            }

//            // ✅ redirect
//            router.push("/reset-password/success")

//        } catch (err) {
//            alert("Something went wrong")
//        }

//        setLoading(false)
//    }

//    return (
//        <div className="flex min-h-screen">

//            {/* LEFT SIDE */}
//            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
//                <div className="mx-auto max-w-md px-8 text-center">
//                    <div className="mb-8 flex justify-center">
//                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
//                            <Calendar className="h-8 w-8 text-primary-foreground" />
//                        </div>
//                    </div>
//                    <h2 className="font-heading text-3xl font-bold text-foreground">
//                        Reset Your Password 🔐
//                    </h2>
//                    <p className="mt-4 leading-relaxed text-muted-foreground">
//                        Enter a new password to secure your account and continue using CalChat+
//                    </p>
//                </div>
//            </div>

//            {/* RIGHT SIDE */}
//            <div className="flex flex-1 items-center justify-center px-4 py-12">
//                <div className="w-full max-w-md">

//                    {/* MOBILE LOGO */}
//                    <div className="mb-8 flex items-center gap-2 lg:hidden">
//                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
//                            <Calendar className="h-5 w-5 text-primary-foreground" />
//                        </div>
//                        <span className="font-heading text-xl font-bold text-foreground">CalChat+</span>
//                    </div>

//                    <h1 className="font-heading text-2xl font-bold text-foreground">
//                        Create new password
//                    </h1>
//                    <p className="mt-2 text-muted-foreground">
//                        Remember your password?{" "}
//                        <Link href="/login" className="text-primary hover:underline">
//                            Sign in
//                        </Link>
//                    </p>

//                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

//                        {/* PASSWORD */}
//                        <div className="flex flex-col gap-2 relative">
//                            <Label>Password</Label>
//                            <Input
//                                type={showPassword ? "text" : "password"}
//                                placeholder="Enter new password"
//                                value={password}
//                                onChange={(e) => setPassword(e.target.value)}
//                                required
//                                className="pr-10"
//                            />
//                            <button
//                                type="button"
//                                onClick={() => setShowPassword(!showPassword)}
//                                className="absolute right-3 top-9 text-muted-foreground"
//                            >
//                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                            </button>
//                        </div>

//                        {/* CONFIRM PASSWORD */}
//                        <div className="flex flex-col gap-2 relative">
//                            <Label>Confirm Password</Label>
//                            <Input
//                                type={showConfirmPassword ? "text" : "password"}
//                                placeholder="Confirm new password"
//                                value={confirmPassword}
//                                onChange={(e) => setConfirmPassword(e.target.value)}
//                                required
//                                className="pr-10"
//                            />
//                            <button
//                                type="button"
//                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                className="absolute right-3 top-9 text-muted-foreground"
//                            >
//                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                            </button>
//                        </div>

//                        {/* SUBMIT */}
//                        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
//                            {loading ? "Resetting..." : "Reset Password"}
//                        </Button>

//                    </form>
//                </div>
//            </div>
//        </div>
//    )
//}


"use client"

import React, { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordContent() {
    const params = useSearchParams()
    const router = useRouter()
    const token = params.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // ✅ NEW (show rules on focus)
    const [showRules, setShowRules] = useState(false)

    // ✅ Password Rules
    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // ✅ validate rules
        if (!Object.values(passwordRules).every(Boolean)) {
            alert("Please satisfy all password conditions")
            return
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("https://steadfast-warmth-production-31cc.up.railway.app/api/account/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    newPassword: password
                })
            })

            const msg = await res.text()

            if (!res.ok) {
                alert(msg || "Error occurred")
                return
            }

            router.push("/reset-password/success")

        } catch {
            alert("Something went wrong")
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen">

            {/* LEFT SIDE */}
            <div className="hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
                <div className="mx-auto max-w-md px-8 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                            <Calendar className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-foreground">
                        Reset Your Password 🔐
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Enter a new password to secure your account
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    <h1 className="text-2xl font-bold">
                        Create new password
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

                        {/* PASSWORD */}
                        <div className="relative">
                            <Label>Password</Label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onFocus={() => setShowRules(true)}   // ✅ show
                                onBlur={() => setShowRules(false)}  // ✅ hide
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* ✅ RULES (ONLY WHEN FOCUS) */}
                        {showRules && (
                            <div className="rounded-lg border p-4 bg-gray-50">
                                <p className="text-sm font-medium mb-2 text-gray-700">
                                    Password must contain:
                                </p>

                                <ul className="space-y-1 text-sm">
                                    <li className={`${passwordRules.length ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.length ? "✔" : "○"} 8+ characters
                                    </li>
                                    <li className={`${passwordRules.uppercase ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.uppercase ? "✔" : "○"} Uppercase letter
                                    </li>
                                    <li className={`${passwordRules.lowercase ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.lowercase ? "✔" : "○"} Lowercase letter
                                    </li>
                                    <li className={`${passwordRules.number ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.number ? "✔" : "○"} Number
                                    </li>
                                    <li className={`${passwordRules.special ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.special ? "✔" : "○"} Special character
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* CONFIRM PASSWORD */}
                        <div className="relative">
                            <Label>Confirm Password</Label>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-9"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* SUBMIT */}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}