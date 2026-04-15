


"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import api from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("student")
    const [agreed, setAgreed] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // ✅ NEW (from Code 1)
    const [showRules, setShowRules] = useState(false)

    // ✅ Password Rules
    const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!agreed) return

        if (!Object.values(passwordRules).every(Boolean)) {
            toast({
                variant: "destructive",
                title: "❌ Weak Password",
                description: "Please satisfy all password conditions",
            })
            return
        }

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "❌ Error",
                description: "Passwords do not match",
            })
            return
        }

        try {
            setLoading(true)
            await api.post("/account/register", { name, email, password, role })
            setOpen(true)
        } catch (err) {
            console.error(err)
            toast({
                variant: "destructive",
                title: "❌ Error",
                description: "Something went wrong",
            })
        } finally {
            setLoading(false)
        }
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
                    <h2 className="text-3xl font-bold">Join CalChat+</h2>
                    <p className="mt-4 text-muted-foreground">
                        Start your journey to smarter productivity.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    <h1 className="text-2xl font-bold">Create your account</h1>

                    <p className="mt-2 text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

                        {/* NAME */}
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                value={name}
                                placeholder="Enter your name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={email}
                                placeholder="you@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* PASSWORD + CONFIRM */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* PASSWORD */}
                            <div className="relative">
                                <Label>Password</Label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onFocus={() => setShowRules(true)}   // ✅ show
                                    onBlur={() => setShowRules(false)}  // ✅ hide
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* CONFIRM */}
                            <div className="relative">
                                <Label>Confirm</Label>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* ✅ RULES (ONLY ON FOCUS) */}
                        {showRules && (
                            <div className="rounded-lg border p-4 bg-gray-50">
                                <p className="text-sm font-medium mb-2 text-gray-700">
                                    Password must contain:
                                </p>

                                <ul className="space-y-1 text-sm">
                                    <li className={`${passwordRules.length ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.length ? "✔" : "○"} At least 8 characters
                                    </li>
                                    <li className={`${passwordRules.uppercase ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.uppercase ? "✔" : "○"} One uppercase letter
                                    </li>
                                    <li className={`${passwordRules.lowercase ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.lowercase ? "✔" : "○"} One lowercase letter
                                    </li>
                                    <li className={`${passwordRules.number ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.number ? "✔" : "○"} One number
                                    </li>
                                    <li className={`${passwordRules.special ? "text-green-600" : "text-gray-400"}`}>
                                        {passwordRules.special ? "✔" : "○"} One special character
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* ROLE */}
                        <div>
                            <Label>Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="hr">HR</SelectItem>
                                    {/*<SelectItem value="admin">Admin</SelectItem>*/}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* TERMS */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={agreed}
                                onCheckedChange={(c) => setAgreed(c === true)}
                            />
                            <span className="text-sm text-muted-foreground">
                                I agree to Terms & Conditions
                            </span>
                        </div>

                        {/* BUTTON */}
                        <Button disabled={!agreed || loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>

                    </form>
                </div>
            </div>

            {/* SUCCESS DIALOG */}
            <Dialog open={open}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">

                    {/* TOP GRADIENT */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">

                        <div className="flex justify-center mb-3">
                            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                                {/* ICON */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold">Success 🎉</h2>
                        <p className="text-sm opacity-90 mt-1">
                            Your account has been created
                        </p>
                    </div>

                    {/* BODY */}
                    <div className="p-6 text-center bg-white">

                        <p className="text-sm text-gray-600">
                            Welcome to <span className="font-semibold text-gray-900">CalChat+</span> 🚀
                            You can now login and start managing your tasks smarter.
                        </p>

                        <Button
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
                            onClick={() => router.push("/login")}
                        >
                            Continue to Login →
                        </Button>

                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}