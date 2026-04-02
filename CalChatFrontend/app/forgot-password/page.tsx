//"use client"

//import { useState } from "react"

//export default function ForgotPasswordPage() {
//    const [email, setEmail] = useState("")
//    const [message, setMessage] = useState("")

//    async function handleSubmit(e: React.FormEvent) {
//        e.preventDefault()

//        const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/account/forgot-password", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json"
//            },
//            body: JSON.stringify({ email })
//        })

//        const data = await res.text()
//        setMessage(data)
//    }

//    return (
//        <div className="flex min-h-screen items-center justify-center">
//            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
//                <h1 className="text-xl font-bold">Forgot Password</h1>

//                <input
//                    type="email"
//                    placeholder="Enter your email"
//                    value={email}
//                    onChange={(e) => setEmail(e.target.value)}
//                    required
//                    className="border p-2 rounded"
//                />

//                <button className="bg-black text-white p-2 rounded">
//                    Send Reset Link
//                </button>

//                {message && <p>{message}</p>}
//            </form>
//        </div>
//    )
//}

"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("https://calchatmain-production-75c1.up.railway.app/api/account/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })

            const data = await res.text()
            setMessage(data)
        } catch (err) {
            console.error(err)
            setMessage("Something went wrong")
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
                        Forgot your password?
                    </h2>

                    <p className="mt-4 leading-relaxed text-muted-foreground">
                        Don’t worry. Enter your email and we’ll send you a reset link.
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
                        <span className="font-heading text-xl font-bold text-foreground">
                            CalChat+
                        </span>
                    </div>

                    <h1 className="font-heading text-2xl font-bold text-foreground">
                        Reset your password
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
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

                        {/* MESSAGE */}
                        {message && (
                            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                                {message}
                            </div>
                        )}

                        {/* SUBMIT */}
                        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}